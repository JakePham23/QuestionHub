'use client';

import React, { useState } from 'react';
import { Card, List, Tag, Input, Select, Avatar, Typography, Space, Button, Pagination } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  views: number;
  image?: string;
}

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Dữ liệu mẫu blog posts
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Hướng dẫn giải bài tập Toán lớp 12 - Hàm số và đạo hàm",
      summary: "Tổng hợp các phương pháp giải bài tập về hàm số và đạo hàm một cách hiệu quả nhất.",
      content: "Nội dung chi tiết về hàm số và đạo hàm...",
      author: "Thầy Nguyễn Văn A",
      publishDate: "2024-08-25",
      category: "Toán học",
      tags: ["Toán 12", "Hàm số", "Đạo hàm"],
      views: 1250,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Chiến lược ôn thi Vật lý THPT Quốc gia",
      summary: "Chia sẻ kinh nghiệm và phương pháp ôn tập Vật lý hiệu quả cho kỳ thi THPT Quốc gia.",
      content: "Nội dung chi tiết về ôn thi Vật lý...",
      author: "Cô Trần Thị B",
      publishDate: "2024-08-20",
      category: "Vật lý",
      tags: ["Vật lý", "THPT", "Ôn thi"],
      views: 980,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Phương pháp học từ vựng Tiếng Anh hiệu quả",
      summary: "Những mẹo và kỹ thuật giúp bạn nhớ từ vựng Tiếng Anh lâu và sử dụng thành thạo.",
      content: "Nội dung chi tiết về học từ vựng...",
      author: "Thầy Lê Văn C",
      publishDate: "2024-08-15",
      category: "Tiếng Anh",
      tags: ["Tiếng Anh", "Từ vựng", "Học tập"],
      views: 1560,
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "Lịch sử Việt Nam - Những sự kiện quan trọng cần nhớ",
      summary: "Tổng hợp các mốc thời gian và sự kiện lịch sử Việt Nam quan trọng cho học sinh THPT.",
      content: "Nội dung chi tiết về lịch sử...",
      author: "Cô Phạm Thị D",
      publishDate: "2024-08-10",
      category: "Lịch sử",
      tags: ["Lịch sử", "Việt Nam", "THPT"],
      views: 750,
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Hóa học hữu cơ - Phản ứng đặc trưng của các hợp chất",
      summary: "Hệ thống hóa các phản ứng đặc trưng trong chương trình Hóa học hữu cơ lớp 12.",
      content: "Nội dung chi tiết về hóa hữu cơ...",
      author: "Thầy Hoàng Văn E",
      publishDate: "2024-08-05",
      category: "Hóa học",
      tags: ["Hóa học", "Hữu cơ", "Lớp 12"],
      views: 1100,
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Sinh học tế bào - Cấu trúc và chức năng",
      summary: "Tìm hiểu về cấu trúc tế bào và các chức năng sinh học cơ bản.",
      content: "Nội dung chi tiết về sinh học tế bào...",
      author: "Cô Nguyễn Thị F",
      publishDate: "2024-07-30",
      category: "Sinh học",
      tags: ["Sinh học", "Tế bào", "Cấu trúc"],
      views: 890,
      image: "/api/placeholder/300/200"
    }
  ];

  const categories = ['all', 'Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'Lịch sử'];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          Question Hub - Blog Học Tập
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '24px' }}>
          Nơi chia sẻ kiến thức và kinh nghiệm học tập
        </Text>

        {/* Search and Filter */}
        <div style={{ marginBottom: '24px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Search
              placeholder="Tìm kiếm bài viết..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={setSearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text strong>Lọc theo môn học:</Text>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ minWidth: '150px' }}
                size="large"
              >
                <Option value="all">Tất cả</Option>
                {categories.slice(1).map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </div>
          </Space>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={paginatedPosts}
        renderItem={(post) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px'
                    }}
                  >
                    📚
                  </div>
                </div>
              }
              actions={[
                <Button type="link" key="read">
                  Đọc tiếp →
                </Button>
              ]}
              style={{ height: '100%' }}
            >
              <Card.Meta
                title={
                  <Title level={4} ellipsis={{ tooltip: true }} style={{ marginBottom: '8px', minHeight: '56px' }}>
                    {post.title}
                  </Title>
                }
                description={
                  <div>
                    <Text type="secondary" ellipsis={{ tooltip: true }} style={{ display: 'block', minHeight: '44px', marginBottom: '12px' }}>
                      {post.summary}
                    </Text>
                    
                    <div style={{ marginBottom: '12px' }}>
                      {post.tags.map((tag, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <Space>
                        <UserOutlined />
                        <Text type="secondary">{post.author}</Text>
                      </Space>
                      <Space>
                        <EyeOutlined />
                        <Text type="secondary">{post.views}</Text>
                      </Space>
                    </div>
                    
                    <div style={{ marginTop: '8px', fontSize: '12px' }}>
                      <Space>
                        <CalendarOutlined />
                        <Text type="secondary">
                          {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                        </Text>
                      </Space>
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      {/* Pagination */}
      {filteredPosts.length > pageSize && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Pagination
            current={currentPage}
            total={filteredPosts.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} bài viết`
            }
          />
        </div>
      )}

      {/* No results */}
      {filteredPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>😔</div>
          <Title level={4}>Không tìm thấy bài viết nào</Title>
          <Text type="secondary">Hãy thử tìm kiếm với từ khóa khác hoặc chọn môn học khác</Text>
        </div>
      )}
    </div>
  );
};

export default BlogPage;