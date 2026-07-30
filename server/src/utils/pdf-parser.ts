// PDF Parser — extract text from PDF and DOCX files
// Will be implemented in Phase 2

// import pdfParse from 'pdf-parse'
// import mammoth from 'mammoth'

/**
 * Extract text from a PDF buffer
 */
export async function parsePDF(_buffer: Buffer): Promise<string> {
  // TODO: Implement with pdf-parse
  throw new Error('Not implemented yet — Phase 2')
}

/**
 * Extract text from a DOCX buffer
 */
export async function parseDOCX(_buffer: Buffer): Promise<string> {
  // TODO: Implement with mammoth
  throw new Error('Not implemented yet — Phase 2')
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
      throw new Error(`Unsupported file type: .${ext}`)
  }
}
