type ToastType = 'success' | 'error' | 'info'

type ToastMessage = {
  id: number
  message: string
  type: ToastType
}

export const useAppToast = () => {
  const toast = useState<ToastMessage | null>('appToast', () => null)

  const notify = (message: string, type: ToastType = 'success') => {
    toast.value = { id: Date.now(), message, type }
  }

  return { notify }
}
