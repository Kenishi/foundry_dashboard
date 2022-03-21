import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

type UpdateAlertProps = {
    updateFunction: () => void;
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateAlert = (props: UpdateAlertProps) => {
    const [open, setOpen] = [props.open, props.setOpen];

    const handleClose = () => {
        setOpen(false);
    }

    const handleUpdate = () => {
        props.updateFunction();
        setOpen(false);
    }

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Begin Foundry Server update?
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You are about to do an update/install on Foundry!<br/>
                <br/>
                Click "Update" to continue and start the update or Cancel to stop.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} autoFocus>Cancel</Button>
            <Button onClick={handleUpdate}>
                Update
            </Button>
            </DialogActions>
        </Dialog>
    )
}