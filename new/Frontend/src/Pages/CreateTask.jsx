import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Select, Tag, Form, Layout, Menu, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined, FileDoneOutlined, LogoutOutlined } from '@ant-design/icons';
import './create.css'; // Create a separate CSS file for styling
import { useNavigate } from 'react-router';

const { Option } = Select;
const { Sider, Content } = Layout;

const CreateTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: '',
  });

  const navigate = useNavigate()

  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_TASK_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/todos/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(Array.isArray(response?.data?.data) ? response?.data?.data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', completed: 'To Do' });
    setEditingTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      completed: value,
    }));
  };

  const handleSubmit = async (values) => {
    try {
      const dataToSubmit = {
        ...values,
        ...(editingTask && { id: editingTask._id }),
        completed: values.completed,
      };

      if (editingTask) {
        await axios.post(`${apiUrl}/todos/edit`, dataToSubmit, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${apiUrl}/todos/add`, dataToSubmit, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      resetForm();
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      completed: task.completed || 'To Do',
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.get(`${apiUrl}/todos/delete?id=${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/')
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed) => (
        <Tag color={completed === 'Completed' ? 'green' : 'red'}>
          {completed}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, task) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(task)}
            style={{ marginRight: '8px' }}
            type="default"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(task._id)}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sider width={250} style={{ backgroundColor: '#f4f4f4', padding: '20px' }}>
          <div className="logo" style={{ padding: '20px', textAlign: 'center' }}>
            <Avatar size={64} icon={<HomeOutlined />} />
            <h3>Task Manager</h3>
          </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<FileDoneOutlined />}>
              Tasks
            </Menu.Item>
            <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main content */}
        <Layout style={{ padding: '0 24px 24px', flex: 1 }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <div style={{ marginBottom: '2rem' }}>
              <Button
                type="primary"
                onClick={() => {
                  setShowForm((prev) => !prev);
                  if (showForm) resetForm();
                }}
                icon={<PlusOutlined />}
              >
                {showForm ? 'Cancel' : editingTask ? 'Edit Task' : 'Create New Task'}
              </Button>
            </div>

            {/* Task Form */}
            {showForm && (
              <Form
                onFinish={handleSubmit}
                style={{
                  marginBottom: '2rem',
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
                initialValues={formData}
              >
                <Form.Item label="Title" name="title" required>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </Form.Item>

                <Form.Item label="Description" name="description" required>
                  <Input.TextArea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Item>

                <Form.Item label="Status" name="completed" required>
                  <Select value={formData.completed} onChange={handleStatusChange}>
                    <Option value="To Do">To Do</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    width: '100%',
                  }}
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </Form>
            )}

            {/* Tasks Table */}
            <Table
              dataSource={tasks}
              columns={columns}
              rowKey="_id"
              pagination={false}
              style={{ marginTop: '2rem' }}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default CreateTask;
