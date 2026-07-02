export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export function validateUploadFile(file: File): string | null {
  const isPdf =
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

  if (!isPdf) {
    return 'Only PDF files are accepted.'
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'File must be 10 MB or smaller.'
  }

  if (file.size === 0) {
    return 'The selected file is empty.'
  }

  return null
}
