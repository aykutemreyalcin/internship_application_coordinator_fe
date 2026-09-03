export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const PDF_TYPES = ['application/pdf']
const DOCX_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function isPdf(file: File): boolean {
  return PDF_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.pdf')
}

function isDocx(file: File): boolean {
  return DOCX_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.docx')
}

function validateFileSize(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'File must be 10 MB or smaller.'
  }
  if (file.size === 0) {
    return 'The selected file is empty.'
  }
  return null
}

export function validateUploadFile(file: File): string | null {
  if (!isPdf(file)) {
    return 'Only PDF files are allowed.'
  }
  return validateFileSize(file)
}

export function validateDocumentUploadFile(file: File): string | null {
  if (!isPdf(file) && !isDocx(file)) {
    return 'Only PDF and Word (.docx) are accepted.'
  }
  return validateFileSize(file)
}

type ApplicationDocumentLike = {
  fileName: string
  contentType?: string | null
}

export function isDocxFile(file: File | ApplicationDocumentLike): boolean {
  if ('type' in file && file instanceof File) {
    return isDocx(file)
  }
  const doc = file as ApplicationDocumentLike
  const name = doc.fileName.toLowerCase()
  const contentType = doc.contentType?.toLowerCase() ?? ''
  return name.endsWith('.docx') || DOCX_TYPES.some((type) => contentType.includes(type))
}
