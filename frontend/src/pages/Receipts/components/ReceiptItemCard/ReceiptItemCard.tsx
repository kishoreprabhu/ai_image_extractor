import { Card, Dropdown, Typography } from "antd";
import { useState } from "react";
import { EllipsisOutlined, FileImageOutlined } from "@ant-design/icons";

import { Receipt } from "../../../../types/receipt";
import DeleteReceipt from "../DeleteReceipt/DeleteReceipt";

const { Text } = Typography;

interface ExtractionCardProps {
  fileName: string;
  date: string;
  status: string;
  cardReceipt: Receipt;
  onView?: (receipt: Receipt) => void;
  onDelete?: (receipt: Receipt) => void;
}

const ReceiptItemCard = ({
  fileName,
  date,
  status,
  cardReceipt,
  onView,
  onDelete,
}: ExtractionCardProps) => {

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const menuItems = [
    { key: "view", label: "View", onClick: () => onView?.(cardReceipt) },
    {
      key: "delete",
      label: <span style={{ color: "red" }}>Delete</span>,
      onClick: () => setDeleteModalOpen(true),
    },
  ];

  const handleConfirmDelete = () => {
    onDelete?.(cardReceipt);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Card className="card-container curs-pointer" onClick={() => onView?.(cardReceipt)}>
        <div className="card-holder">

          {/* left section */}
          <div className="card-left-blk">
           <div className="thumbnail-box">
                {cardReceipt?.publicUrl ? (
                  <img
                    src={cardReceipt.publicUrl}
                    alt="thumbnail"
                    className="thumbnail-img"
                  />
                ) : (
                  <FileImageOutlined className="color-999" style={{ fontSize: "32px" }} />
                )}
            </div>

            <div>
              <Text strong>{fileName}</Text>
              <br />
              <Text type="secondary">{date}</Text>
            </div>
          </div>

          {/* right section */}
          <div className="card-right-blk" onClick={(e) => e.stopPropagation()}>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
              <EllipsisOutlined className="ft-size-20 curs-pointer" />
            </Dropdown>
            <Text>{status}</Text>
          </div>

        </div>
      </Card>

      {/* delete card confirmation modal */}
      <DeleteReceipt 
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          handleConfirmDelete={handleConfirmDelete}
      />
     
    </>
  );
};

export default ReceiptItemCard;
