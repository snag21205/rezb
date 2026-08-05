import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

/**
 * Extract text from a PDF buffer
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer)
  return data.text.trim()
}

/**
 * Extract text from a DOCX buffer
 */
export async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value.trim()
}

/**
 * Detect file type and parse accordingly
 */
export async function parseCV(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.toLowerCase().split('.').pop()
  switch (ext) {
    case 'pdf':
      return parsePDF(buffer)
    case 'docx':
      return parseDOCX(buffer)
    default:
      throw new Error(`Unsupported file type: .${ext}. Only PDF and DOCX are supported.`)
  }
}
