import * as React from 'react';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


export type FormDialogProps<T> = {
    title: string
    buttonText: string
    contentText?: string
    formSubmit: (data: T) => void
    children?: React.ReactNode
    styleDiv?: string
};

export default function FormDialog<T>({ title, buttonText, contentText, formSubmit, children, styleDiv }: FormDialogProps<T>) {
    const [ open, setOpen ] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement> ) => {
        event.preventDefault()
        formSubmit(undefined as unknown as T)
        handleClose()
    }

    return (
        <div className={styleDiv}>
            <Button variant="outlined" onClick={handleClickOpen}>
                {buttonText}
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                {contentText && <DialogContentText>{contentText}</DialogContentText>}
                <form onSubmit={handleSubmit} id="form">
                    {children}
                </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" form="form">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
