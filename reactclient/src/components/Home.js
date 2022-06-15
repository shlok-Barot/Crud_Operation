import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Modal, Input, Radio, message } from "antd";
import "antd/dist/antd.min.css";
import WhatsApp from "../Assets/images/whatsapp.png";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userEditData, setUserEditData] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  const getTableData = async () => {
    const response = await axios.get("http://localhost:5000/api/get");
    setData(response.data);
  };

  useEffect(() => {
    getTableData();
  }, []);

  const UserData = async () => {
    const { FirstName, LastName, Gender, Age, MobileNo, Country, Id } =
      userEditData;
    if (modalTitle === "New User") {
      await axios
        .post("http://localhost:5000/api/add_user", {
          FirstName,
          LastName,
          Gender,
          Age,
          MobileNo,
          Country,
        })
        .then((res) => {
          console.log("Data Added", res);
        })
        .catch((err) => console.log(err, "Error"));
      message.success("User Added Successfully.");
      setIsModalVisible(false);
      getTableData();
    } else {
      await axios
        .put(`http://localhost:5000/api/update_user/${Id}`, {
          FirstName,
          LastName,
          Gender,
          Age,
          MobileNo,
          Country,
        })
        .then((res) => {
          console.log("Data Updated", res);
        })
        .catch((err) => console.log(err, "Error"));
      message.success("Data Updated Successfully.");
      setIsModalVisible(false);
      getTableData();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditopen = (data, type) => {
    console.log(data, "data");
    if (type === "Add") {
      setModalTitle("New User");
      setUserEditData({});
    } else {
      setModalTitle("Update User");
      setUserEditData(data);
    }
    setIsModalVisible(true);
  };

  const DeleteData = (id) => {
    if (window.confirm("Are you sure that you wanted to delete this User ?")) {
      axios.delete(`http://localhost:5000/api/remove_user/${id}`);
      message.success("User Deleted Successfully.");
      getTableData();
    }
  };

  const ShareUserDataToWhatsApp = (data) => {
    if (
      window.confirm(
        `Are you sure that you want to share this data to ${data.FirstName}?`
      )
    ) {
      var textContent=`${data.FirstName},%0a%0a *Your Basic Details are below* %0a%0a *FirstName*:${data.FirstName}, %0a *LastName*:${data.LastName}, %0a *Age*:${data.Age}, %0a *Country*:${data.Country} %0a%0a%0a Regards, %0a *Test App*`
      var tempData = `https://api.whatsapp.com/send?phone=91${data.MobileNo}&text=Hi ${textContent}`;
      window.open(tempData, "_blank");
    }
  };

  const handleInputOnChange = (e) => {
    setUserEditData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div>
      <h3>Crud Opetion</h3>
      <div>
        <Button
          type="primary"
          className="Editbtn"
          onClick={() => handleEditopen("", "Add")}
        >
          Add New User
        </Button>
      </div>
      <div className="content_padding">
        <Table
          columns={[
            {
              title: "Full Name",
              dataIndex: "FirstName",
              key: "1",
              render: (item, row) => {
                return row.FirstName + " " + row.LastName;
              },
            },
            {
              title: "Gender",
              dataIndex: "Gender",
              key: "2",
            },
            {
              title: "Age",
              dataIndex: "Age",
              key: "3",
              sorter: {
                compare: (a, b) => a.Age - b.Age,
                multiple: 2,
              },
            },
            {
              title: "Country",
              dataIndex: "Country",
              key: "4",
            },
            {
              title: "Mobile No",
              dataIndex: "MobileNo",
              key: "5",
            },
            {
              title: "Action",
              dataIndex: "6",
              key: "6",
              render: (item, row) => (
                <div className="action_btn">
                  <Button
                    type="primary"
                    className="Editbtn"
                    onClick={() => handleEditopen(row, "Edit")}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this data?"
                    onConfirm={() => DeleteData(row.Id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              ),
            },
            {
              title: "Share Media",
              dataIndex: "7",
              key: "7",
              render: (item, row) => (
                <img
                  src={WhatsApp}
                  alt="img"
                  className="whatsappIcon"
                  onClick={() => ShareUserDataToWhatsApp(row)}
                />
              ),
            },
          ]}
          dataSource={data}
        />
      </div>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onOk={UserData}
        onCancel={handleCancel}
        okText="Save"
      >
        <div className="modal_pd">
          <label>First Name </label>
          <Input
            size="large"
            placeholder="Enter First Name"
            name="FirstName"
            value={userEditData.FirstName}
            onChange={handleInputOnChange}
          />
        </div>
        <div className="modal_pd">
          <label>Last Name </label>
          <Input
            size="large"
            placeholder="Enter Last Name"
            name="LastName"
            value={userEditData.LastName}
            onChange={handleInputOnChange}
          />
        </div>
        <div className="gender_content">
          <label>Gender </label>
          <Radio.Group
            onChange={handleInputOnChange}
            name="Gender"
            value={userEditData.Gender}
          >
            <Radio value={"Male"}>Male</Radio>
            <Radio value={"Female"}>Female</Radio>
          </Radio.Group>
        </div>
        <div className="modal_pd">
          <label>Age </label>
          <Input
            size="large"
            placeholder="Enter Age"
            type="number"
            min="15"
            max="55"
            name="Age"
            value={userEditData.Age}
            onChange={handleInputOnChange}
          />
        </div>
        <div className="modal_pd">
          <label>Country Name </label>
          <Input
            size="large"
            placeholder="Enter Country Name"
            name="Country"
            value={userEditData.Country}
            onChange={handleInputOnChange}
          />
        </div>
        <div className="modal_pd">
          <label>Mobile No </label>
          <Input
            size="large"
            placeholder="Enter Mobile No"
            type="number"
            min="0"
            max="10"
            name="MobileNo"
            value={userEditData.MobileNo}
            onChange={handleInputOnChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
