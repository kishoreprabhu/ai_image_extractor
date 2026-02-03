import { Button, Empty, Typography, Row, Col, notification } from "antd";
import { useState, useEffect } from "react";
import ReceiptCardView from "./components/ReceiptItemCard";
import AddReceipt from "./components/AddReceipt";
import ReceiptDetailView from "./components/ReceiptDetailView";

import { ReceiptList, Receipt, PaginationResponse } from "../../types/receipt";
import { getUserReceipts, deleteUserReceipt, getReceiptsByIds } from "../../services/receipts";
import { STATUS_EXTRACTED, STATUS_FAILED, 
        STATUS_INVALID, POLLING_INTERVAl} from "../../shared/constant";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect( ()=> {
    fetchReceipts();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const activeIds = JSON.parse(localStorage.getItem("active_receipt_ids") || "[]");
      if(activeIds.length === 0) return;

      const updatedReceipts = await getReceiptsByIds(activeIds);
      let receiptsStatus:Receipt[] | []= updatedReceipts?.data || [];
      showToast(receiptsStatus, activeIds);
    }, POLLING_INTERVAl);

    return () => clearInterval(interval);
  }, []);

  const showToast = (receiptsStatus: Receipt[], activeIds: string[]) => {
    const statusConfig: Record<string, "success" | "error"> = {
      [STATUS_EXTRACTED]: "success",
      [STATUS_FAILED]: "error",
      [STATUS_INVALID]: "error",
    };

    const removeActiveReceiptId = (id: string) => {
      const remaining = activeIds.filter(activeId => activeId !== id);
      localStorage.setItem("active_receipt_ids", JSON.stringify(remaining));
    };

    receiptsStatus.forEach(receipt => {
      const toastType = statusConfig[receipt.status];

      // showing toast only when valid toast type exist  
      if (!toastType) return;

      const key = receipt.id;

      notification[toastType]({
        key,
        duration: 0,
        description: (
          <div>
            Receipt "<strong>{receipt.fileName}</strong>"{" "}
            {receipt.status === STATUS_EXTRACTED && "extraction completed successfully."}
            {receipt.status === STATUS_FAILED && "extraction failed."}
            {receipt.status === STATUS_INVALID && "invalid receipt. Extraction aborted."}{" "}
            <a
              onClick={() => {
                handleCardClick(receipt);
                notification.destroy(key);
              }}
            >
              View now
            </a>
          </div>
        ),
      });

      //removing id of receipt from localstorage  
      removeActiveReceiptId(receipt.id);
      fetchReceipts();
    });
  };



  const fetchReceipts = async()=> {
    const receiptsList:ReceiptList = await getUserReceipts();
    setReceipts(receiptsList.items);
  }

  const handleNewExtraction = () => {
      setOpen(true);
  };

  const handleCardClick = (receipt: Receipt) => {
    console.log("I am setting selectinf receipt");
    setSelectedReceipt(receipt);
    setDetailOpen(true);
  };

  const handleReceiptDelete = async(receipt: Receipt|null) => {
     if(receipt) {
        const response:Receipt = await deleteUserReceipt(receipt.id);
        if (response.id === receipt.id) {
          notification.success({
              description: `${receipt.fileName} is deleted successfully`
          })
          fetchReceipts();
        } else {
            notification.error({
              description: `${receipt.fileName} can't able to delete, please try again.`
            })
        }
      }
  }


  return (
    <div className="p-30">
      {/* Header */}
      <div>
        <Row justify="space-between" align="middle" className="mb-30">
          <Col>
            <Title level={2} className="m-all-0">
              My Extractions
            </Title>
          </Col>
          <Col>
            <Button type="primary" onClick={handleNewExtraction}>
              + New Extraction
            </Button>
          </Col>
        </Row>
        <AddReceipt 
          open={open} 
          onClose={() => setOpen(false)} 
          fetchReceipts={fetchReceipts}
        />
      </div>

      {/* Content */}
      {receipts.length === 0 ? (
        <div className="txt-center" style={{ marginTop: "120px" }}>
          <Empty description={false} />
          <Text>No extractions found.</Text>
          <br />
          <Text>
            Click <strong>"New Extraction"</strong> to begin.
          </Text>
        </div>
      ) : (
        <div>
            {receipts.map( (receipt:Receipt,index) => {
                return (
                    <div key={index}>
                      <ReceiptCardView
                        fileName={receipt.fileName}
                        date={receipt.uploadedAt}
                        status={receipt.status}
                        onView={handleCardClick}
                        onDelete={handleReceiptDelete}
                        cardReceipt={receipt}
                      />
                    </div>
                )
            })}
            
            <>
              <ReceiptDetailView
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                onDelete={() => handleReceiptDelete(selectedReceipt)}
                data={selectedReceipt}
              />
            </>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
