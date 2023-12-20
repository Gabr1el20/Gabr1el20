const fs = require('node:fs')

// Función para realizar la solicitud a la API
async function fetchDataFromAPI () {
  try {
    const response = await fetch('https://oq5npnwovb.execute-api.us-east-1.amazonaws.com/default/randomSakuga') // Reemplaza 'URL_DE_TU_API' con la URL real de tu API
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener datos de la API:', error)
    throw error
  }
}

function getImageSrcFromContent (content) {
  // Expresión regular para buscar el valor después de src=
  const regex = /src="(.*?)"/

  // Ejecutar la expresión regular en el contenido del archivo
  const match = content.match(regex)

  // Si se encuentra una coincidencia, devolver el valor capturado, de lo contrario, devolver null
  return match ? match[1] : null
}

function getAnimatorFromContent (content) {
  const regex = /Key animation: -(.*?)-/ // Expresión regular para buscar el valor después de Key animation:
  const match = content.match(regex)
  return match ? match[1] : null
}

function getSeriesFromContent (content) {
  const regex = /From -(.*?)-/ // Expresión regular para buscar el valor después de Series:
  const match = content.match(regex)
  return match ? match[1] : null
}

// Función para actualizar el archivo TEST.md con el nuevo valor de src
async function updateTestFile (imageSrc, animator, series) {
  try {
    const testFilePath = 'README.md' // Reemplaza 'RUTA_A_TEST.md' con la ruta real de tu archivo TEST.md
    let testFileContent = fs.readFileSync(testFilePath, 'utf-8')

    const urlToChange = getImageSrcFromContent(testFileContent)
    const KAToChange = getAnimatorFromContent(testFileContent)
    const SeriesToChange = getSeriesFromContent(testFileContent)
    // Reemplazar {{IMAGE_SRC}} con el nuevo valor
    testFileContent = testFileContent.replace(urlToChange, imageSrc).replace(KAToChange, animator).replace(SeriesToChange, series)

    // Guardar el archivo actualizado
    fs.writeFileSync(testFilePath, testFileContent, 'utf-8')

    console.log('Archivo TEST.md actualizado correctamente.')
  } catch (error) {
    console.error('Error al actualizar el archivo TEST.md:', error)
    throw error
  }
}

// Función principal para realizar la tarea completa
async function main () {
  try {
    const apiData = await fetchDataFromAPI()
    const imageSrc = apiData.url
    const keyAnimator = apiData['author(s)']
    const source = `${apiData.series}: ${apiData.source}`

    // Actualizar el archivo TEST.md con el nuevo valor de src
    await updateTestFile(imageSrc, keyAnimator, source)
  } catch (error) {
    console.error('Error en el script principal:', error)
  }
}

// Ejecutar la función principal
main()
