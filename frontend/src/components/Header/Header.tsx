import { Dropdown, MenuProps } from "antd";
import { HeaderProps } from "../../types/header";

const Header = ({userIntial, onLogout}: HeaderProps) => {

    const items: MenuProps["items"] = [
        {
            key: "logout",
            label: <span className="color-black">Logout</span>,
            onClick: onLogout,
        },
    ];

    return (
        <header id="app-header">
            <h2 className="m-all-0">Receipt Extractor</h2>
            <Dropdown menu={{ items }} trigger={['click']}>
                <div id="user-avatar">
                    {userIntial}
                </div>
            </Dropdown>
        </header>
    )
}

export default Header