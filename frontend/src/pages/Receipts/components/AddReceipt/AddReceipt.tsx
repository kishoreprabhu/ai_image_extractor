import { Modal, Upload, Button, Typography, notification, Spin, } from "antd";
import { InboxOutlined, FileOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

import { uploadReceipt } from "../../../../services/receipts";
import { ALLOWED_FILE_TYPES, IMAGE_UPLOAD_ERROR_MSG } from "../../../../shared/constant";
import { AddReceiptResponse } from "../../../../types/receipt";

const { Dragger } = Upload;
const { Text } = Typography;

type ExtractionModalProps = {
  open: boolean | undefined;
  onClose: () => void;
  fetchReceipts: () => void;
};

const AddReceipt = ({ open, onClose, fetchReceipts }: ExtractionModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadProps = {
    beforeUpload: (file: File) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        notification.error({
          description: IMAGE_UPLOAD_ERROR_MSG,
        });
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false;
    },
  };

  const removeFile = () => !loading && setFile(null);

  const handleClose = () => {
    //if (loading) return; 
    setFile(null);
    onClose();
  };

  const handleExtract = async() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file as File);
    
    const response:AddReceiptResponse = await uploadReceipt(formData);
    if(response?.message) {
        //console.log(response);
       //storing active receipt id to check status
       const existing = JSON.parse(localStorage.getItem("active_receipt_ids") || "[]");
       localStorage.setItem("active_receipt_ids", JSON.stringify([...existing, response?.receipt?.id]));

       //success workflow
       notification.success({ message: response.message });
       setLoading(false);
       handleClose();
       fetchReceipts();
    }
  };

  const uploadedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={600}
      maskClosable={false}
      closable={false}
    >
      <div className="modal-header">
        <span className="close-btn" onClick={handleClose}>✕</span>
        <h3>New Extraction</h3>
      </div>

      {!file && !loading && (
        <Dragger {...uploadProps} className="p-30 mt-20">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Choose file to Upload</p>
          <p>or drag and drop file here</p>
        </Dragger>
      )}

      {file && !loading && (
        <div className="file-preview-card">
          <div className="file-left">
            <FileOutlined className="ft-size-40 color-999"/>
          </div>

          <div className="file-details">
            <Text strong>{file.name}</Text>
            <br />
            <Text type="secondary">Uploaded by User</Text>
            <br />
            <Text type="secondary">Uploaded on {uploadedAt}</Text>
          </div>

          <div className="file-remove" onClick={removeFile}>
            <CloseOutlined />
          </div>
        </div>
      )}

      {loading && (
        <div className="txt-center ptb-40">
          <Spin indicator={<LoadingOutlined className="ft-size-40" spin />} />
          <div className="mt-10">
            <Text strong>Submitting Receipt...</Text>
          </div>
        </div>
      )}

      <div className="modal-footer">
        <Button danger disabled={loading} onClick={handleClose}>Cancel</Button>
        <Button type="primary" disabled={!file || loading} onClick={handleExtract}>
          {loading ? "Processing..." : "Extract"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddReceipt;
