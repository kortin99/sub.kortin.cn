import { useDialog, useMessage } from 'naive-ui'

type DialogStatus = 'default' | 'success' | 'warning' | 'error'

export function useFeedback() {
  const dialog = useDialog()
  const message = useMessage()

  const showDialog = (
    status: DialogStatus,
    title: string,
    content: string,
    callback?: (() => void) | null
  ) => {
    const openDialog = status === 'success'
      ? dialog.success
      : status === 'error'
        ? dialog.error
        : status === 'warning'
          ? dialog.warning
          : dialog.info

    openDialog({
      title,
      content,
      positiveText: '确定',
      onPositiveClick: callback ?? undefined,
    })
  }

  const showNotification = (content: string, type: 'success' | 'error' = 'success') => {
    message[type](content)
  }

  return { showDialog, showNotification }
}
