import { Card, Descriptions, Avatar, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const { user } = useAuthStore()

  return (
    <Card title="个人信息">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar size={80} icon={<UserOutlined />} src={user?.avatarUrl} />
        <h2 style={{ marginTop: 16 }}>{user?.firstName} {user?.lastName}</h2>
        <p style={{ color: '#666' }}>{user?.email}</p>
      </div>

      <Descriptions column={1}>
        <Descriptions.Item label="用户ID">{user?.id}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="姓名">{user?.firstName} {user?.lastName}</Descriptions.Item>
        <Descriptions.Item label="角色">{user?.roles?.join(', ')}</Descriptions.Item>
        <Descriptions.Item label="权限">{user?.permissions?.length} 个权限</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button type="primary">编辑信息</Button>
      </div>
    </Card>
  )
}
