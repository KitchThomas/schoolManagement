import { Row, Col, Card, Statistic } from 'antd'
import { UserOutlined, BookOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons'

export default function Dashboard() {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="课程数量"
              value={56}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="作业数量"
              value={89}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="完成率"
              value={87.5}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="最近活动" style={{ height: 400 }}>
            <p>• 用户 张三 完成了课程《React 基础》</p>
            <p>• 用户 李四 提交了作业《第一章练习》</p>
            <p>• 教师 王老师 创建了新课程《TypeScript 进阶》</p>
            <p>• 管理员 审核通过了5个新用户</p>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="快速操作">
            <p>• 创建新课程</p>
            <p>• 添加新用户</p>
            <p>• 查看报表</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
