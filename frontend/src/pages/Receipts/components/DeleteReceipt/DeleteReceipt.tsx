import { Modal } from "antd";

type ExtDelModalProps = {
    deleteModalOpen: boolean;
    setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleConfirmDelete: () => void;
}
const DeleteReceipt = ({deleteModalOpen, 
                            setDeleteModalOpen, 
                            handleConfirmDelete}:ExtDelModalProps) => {
    return (
        <Modal
            open={deleteModalOpen}
            centered
            title="Are you sure?"
            onCancel={() => setDeleteModalOpen(false)}
            onOk={handleConfirmDelete}
            okText="Yes"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            maskClosable={false}
            closable={false}
        >
            <p>Are you sure want to permantely delete this record?</p>
        </Modal>
    )
}

export default DeleteReceipt;