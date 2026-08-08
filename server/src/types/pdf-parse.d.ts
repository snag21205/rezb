declare module 'pdf-parse' {
  function pdfParse(
    dataBuffer: Buffer,
    options?: Record<string, any>
  ): Promise<{
    numpages: number
    numrender: number
    info: any
    metadata: any
    version: string
    text: string
  }>
  export default pdfParse
}
