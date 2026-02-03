import { useState } from "react";
import { Modal, Button, Typography, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { Receipt } from "../../../../types/receipt";
import { STATUS_EXTRACTED, STATUS_EXTRACTING, 
  STATUS_FAILED, STATUS_INVALID } from "../../../../shared/constant";
import DeleteReceipt from "../DeleteReceipt/DeleteReceipt";

const { Text, Title } = Typography;

type ReceiptDetailViewProps = {
  open: boolean;
  onClose: () => void;
  onDelete:(receipt:Receipt|null) => void;
  data: Receipt | null;
};

const ReceiptDetailView = ({ open, onClose, onDelete, data }: ReceiptDetailViewProps) => {
  if (!data) return null;
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const LLMResponse = data?.extraction?.extractedJson?.data;
  
  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
    onDelete?.(data);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width="80%"
      centered
      maskClosable={false}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <ArrowLeftOutlined
          onClick={onClose}
          style={{ fontSize: 20, marginRight: 10, cursor: "pointer" }}
        />
        <Title level={4} style={{ margin: 0 }}>{data.fileName}</Title>
        <Text style={{ marginLeft: "auto" }}>
          Status: <strong>{data.status}</strong>
        </Text>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        
        {/* Receipt Image */}
        <div style={{
          border: "1px solid #ddd",
          width: "40%",
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa"
        }}>
          {data.publicUrl
            ? <img src={data.publicUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            : <Text type="secondary">Receipt Image</Text>
          }
        </div>

        {/* display for status EXTRACTED */}
        {data.status == STATUS_EXTRACTED && <div style={{ width: "60%", maxHeight: 500, overflowY: "scroll" }}>
          <Title level={4}>{LLMResponse.vendorName}</Title>
          <Text>{LLMResponse.date}</Text> <br />
          <Text>{LLMResponse.currency}</Text>
          <Divider />

          {LLMResponse.items.map((item) => (
            <div key={item.itemName} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>{item.itemName}</Text>
              <Text>${item.itemCost}</Text>
            </div>
          ))}

          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>GST/Tax</Text>
            <Text>${LLMResponse.gst}</Text>
          </div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
            <Text strong>Total</Text>
            <Text strong>${LLMResponse.total}</Text>
          </div>
        </div>}

         {/* display for status FAILED */}
         {data.status === STATUS_FAILED && <div style={{ width: "60%", maxHeight: 500, overflowY: "scroll" }}>
          <Title level={4}>Extraction Failed</Title>
          <Text>Reason: JSON Parsing Failed</Text> 
         </div>}

         {/* display for status EXTRACTING */}
         {data.status === STATUS_EXTRACTING && <div style={{ width: "60%", maxHeight: 500, overflowY: "scroll" }}>
          <Title level={4}>Receipt extraction in progress</Title>
          <Text>Extraction results will be visible once completed.</Text> 
         </div>}

         {/* display for status INVALID */}
         {data.status === STATUS_INVALID && <div style={{ width: "60%", maxHeight: 500, overflowY: "scroll" }}>
          <Title level={4}>Receipt extraction in invalid</Title>
         </div>}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Button danger onClick={()=> setDeleteModalOpen(true)}>Delete</Button>
        <Button onClick={onClose} type="primary">Done</Button>
      </div>

      <DeleteReceipt 
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          handleConfirmDelete={handleConfirmDelete}
      />
    </Modal>
  );
};

export default ReceiptDetailView;
