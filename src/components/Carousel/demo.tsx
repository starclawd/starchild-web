import React, { useState } from 'react'
import styled from 'styled-components'
import Carousel from './index'
import { ImgListType } from 'store/application/application.d'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({theme}) => theme.bgL1};
  color: ${({theme}) => theme.textL1};
  min-height: 100vh;
  
  h2 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  h3 {
    color: ${({theme}) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  p {
    color: ${({theme}) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;
  
  h2 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  h3 {
    color: ${({theme}) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  p {
    color: ${({theme}) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const CarouselContainer = styled.div`
  width: 100%;
  height: 300px;
  margin: 20px 0;
  background: ${({theme}) => theme.bgL2};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`

const SampleItem = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  border-radius: 8px;
  position: relative;
  
  .item-content {
    text-align: center;
    
    .item-title {
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .item-desc {
      font-size: 14px;
      opacity: 0.8;
    }
  }
`

const ImageItem = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white;
    padding: 20px;
    
    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .desc {
      font-size: 14px;
      opacity: 0.9;
    }
  }
`

const StatusDisplay = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${({theme}) => theme.bgL2};
  border-radius: 8px;
  
  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .label {
      color: ${({theme}) => theme.textL3};
    }
    
    .value {
      color: ${({theme}) => theme.textL1};
      font-weight: 500;
    }
  }
`

const CardItem = styled.div`
  width: 100%;
  height: 100%;
  background: ${({theme}) => theme.bgL0};
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({theme}) => theme.lineDark8};
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: ${({theme}) => theme.textL1};
    margin-bottom: 8px;
  }
  
  .desc {
    font-size: 14px;
    color: ${({theme}) => theme.textL3};
    text-align: center;
    line-height: 1.4;
  }
`

const CodeBlock = styled.pre`
  background: ${({theme}) => theme.bgL2};
  color: ${({theme}) => theme.textL1};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
`

const PropsTable = styled.div`
  background: ${({theme}) => theme.bgL2};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  font-weight: 600;
  border-bottom: 1px solid ${({theme}) => theme.lineDark8};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${({theme}) => theme.textL1};
`

const PropsTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({theme}) => theme.lineDark8}10;
  
  &:last-child {
    border-bottom: none;
  }
`

const PropsTableCell = styled.div<{ type?: 'prop' | 'type' | 'default' | 'desc' }>`
  font-family: ${props => props.type === 'prop' || props.type === 'type' || props.type === 'default' ? 'monospace' : 'inherit'};
  color: ${({theme, type}) => {
    switch(type) {
      case 'prop': return theme.textL1;
      case 'type': return theme.brand6;
      case 'default': return theme.textL3;
      default: return theme.textL2;
    }
  }};
`

const CarouselDemo = () => {
  const [currentIndex1, setCurrentIndex1] = useState(0)
  const [currentIndex2, setCurrentIndex2] = useState(0)
  const [currentIndex3, setCurrentIndex3] = useState(0)

  // 基础轮播数据
  const basicData: ImgListType[] = [
    {
      key: '1',
      id: '1',
      customerItem: (
        <SampleItem bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <div className="item-content">
            <div className="item-title">第一页</div>
            <div className="item-desc">这是第一个轮播项</div>
          </div>
        </SampleItem>
      )
    },
    {
      key: '2',
      id: '2',
      customerItem: (
        <SampleItem bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <div className="item-content">
            <div className="item-title">第二页</div>
            <div className="item-desc">这是第二个轮播项</div>
          </div>
        </SampleItem>
      )
    },
    {
      key: '3',
      id: '3',
      customerItem: (
        <SampleItem bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <div className="item-content">
            <div className="item-title">第三页</div>
            <div className="item-desc">这是第三个轮播项</div>
          </div>
        </SampleItem>
      )
    }
  ]

  // 图片轮播数据
  const imageData: ImgListType[] = [
    {
      key: 'img1',
      id: 'img1',
      customerItem: (
        <ImageItem>
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Mountain Lake" />
          <div className="overlay">
            <div className="title">山湖美景</div>
            <div className="desc">宁静的湖水倒映着远山</div>
          </div>
        </ImageItem>
      )
    },
    {
      key: 'img2',
      id: 'img2',
      customerItem: (
        <ImageItem>
          <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop" alt="Forest Path" />
          <div className="overlay">
            <div className="title">森林小径</div>
            <div className="desc">阳光透过树林洒在小径上</div>
          </div>
        </ImageItem>
      )
    },
    {
      key: 'img3',
      id: 'img3',
      customerItem: (
        <ImageItem>
          <img src="https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=400&h=300&fit=crop" alt="Beach Sunset" />
          <div className="overlay">
            <div className="title">海滩日落</div>
            <div className="desc">夕阳西下的海滩风光</div>
          </div>
        </ImageItem>
      )
    }
  ]

  // 卡片轮播数据
  const cardData: ImgListType[] = [
    {
      key: 'card1',
      id: 'card1',
      customerItem: (
        <CardItem>
          <div className="icon">📊</div>
          <div className="title">数据分析</div>
          <div className="desc">通过可视化图表展示数据洞察，帮助您做出更好的决策</div>
        </CardItem>
      )
    },
    {
      key: 'card2',
      id: 'card2',
      customerItem: (
        <CardItem>
          <div className="icon">🚀</div>
          <div className="title">快速部署</div>
          <div className="desc">一键部署功能让您的应用快速上线，节省宝贵时间</div>
        </CardItem>
      )
    },
    {
      key: 'card3',
      id: 'card3',
      customerItem: (
        <CardItem>
          <div className="icon">🔒</div>
          <div className="title">安全保障</div>
          <div className="desc">企业级安全防护，保障您的数据和隐私安全</div>
        </CardItem>
      )
    },
    {
      key: 'card4',
      id: 'card4',
      customerItem: (
        <CardItem>
          <div className="icon">💡</div>
          <div className="title">智能推荐</div>
          <div className="desc">基于AI算法的智能推荐系统，为您提供个性化体验</div>
        </CardItem>
      )
    }
  ]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Carousel 轮播图组件示例</h2>
        <p>
          轮播图组件专为移动端设计，支持触摸滑动切换，提供流畅的用户体验。
          组件包含进度条指示器，支持自定义内容，适用于图片展示、内容推荐等场景。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最基本的轮播图展示，支持触摸滑动和进度条指示</p>
        
        <CarouselContainer>
          <Carousel 
            dataList={basicData}
            onChange={(index) => setCurrentIndex1(index)}
          />
        </CarouselContainer>
        
        <StatusDisplay>
          <div className="status-item">
            <span className="label">当前页面:</span>
            <span className="value">{currentIndex1 + 1} / {basicData.length}</span>
          </div>
          <div className="status-item">
            <span className="label">当前页面 ID:</span>
            <span className="value">{basicData[currentIndex1]?.id}</span>
          </div>
        </StatusDisplay>
        
        <CodeBlock>
{`// 定义轮播数据
const dataList: ImgListType[] = [
  {
    key: '1',
    id: '1',
    customerItem: (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: '8px'
      }}>
        <div>
          <h3>第一页</h3>
          <p>这是第一个轮播项</p>
        </div>
      </div>
    )
  },
  // ... 更多数据项
]

// 使用组件
<Carousel 
  dataList={dataList}
  onChange={(index) => console.log('当前页面:', index)}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>图片轮播</h3>
        <p>展示图片内容的轮播图，适用于图片画廊、产品展示等场景</p>
        
        <CarouselContainer>
          <Carousel 
            dataList={imageData}
            onChange={(index) => setCurrentIndex2(index)}
          />
        </CarouselContainer>
        
        <StatusDisplay>
          <div className="status-item">
            <span className="label">当前图片:</span>
            <span className="value">{currentIndex2 + 1} / {imageData.length}</span>
          </div>
        </StatusDisplay>
        
        <CodeBlock>
{`// 图片轮播数据
const imageData: ImgListType[] = [
  {
    key: 'img1',
    id: 'img1',
    customerItem: (
      <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <img 
          src="https://example.com/image1.jpg" 
          alt="图片描述"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
          padding: '20px'
        }}>
          <h3>图片标题</h3>
          <p>图片描述信息</p>
        </div>
      </div>
    )
  }
  // ... 更多图片
]

<Carousel dataList={imageData} onChange={handleChange} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>卡片轮播</h3>
        <p>展示卡片内容的轮播图，适用于功能介绍、服务展示等场景</p>
        
        <CarouselContainer>
          <Carousel 
            dataList={cardData}
            onChange={(index) => setCurrentIndex3(index)}
          />
        </CarouselContainer>
        
        <StatusDisplay>
          <div className="status-item">
            <span className="label">当前卡片:</span>
            <span className="value">{currentIndex3 + 1} / {cardData.length}</span>
          </div>
          <div className="status-item">
            <span className="label">卡片 ID:</span>
            <span className="value">{cardData[currentIndex3]?.id}</span>
          </div>
        </StatusDisplay>
        
        <CodeBlock>
{`// 卡片轮播数据
const cardData: ImgListType[] = [
  {
    key: 'card1',
    id: 'card1',
    customerItem: (
      <div style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h3>数据分析</h3>
        <p>通过可视化图表展示数据洞察</p>
      </div>
    )
  }
  // ... 更多卡片
]

<Carousel dataList={cardData} onChange={handleChange} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>单项展示</h3>
        <p>当只有一个项目时，轮播图会隐藏进度条和滑动功能</p>
        
        <CarouselContainer>
          <Carousel 
            dataList={[basicData[0]]}
            onChange={(index) => console.log('单项展示:', index)}
          />
        </CarouselContainer>
        
        <CodeBlock>
{`// 单项数据
const singleData: ImgListType[] = [
  {
    key: 'single',
    id: 'single',
    customerItem: <YourComponent />
  }
]

// 单项展示时不会显示进度条，也无法滑动
<Carousel dataList={singleData} onChange={handleChange} />`}
        </CodeBlock>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>
          Carousel 组件支持的所有属性参数
        </p>
        
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          
          <PropsTableRow>
            <PropsTableCell type="prop">dataList</PropsTableCell>
            <PropsTableCell type="type">ImgListType[]</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">轮播图数据列表</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">onChange</PropsTableCell>
            <PropsTableCell type="type">function</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">轮播图切换时的回调函数</PropsTableCell>
          </PropsTableRow>
        </PropsTable>
        
        <h3>ImgListType 数据结构</h3>
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          
          <PropsTableRow>
            <PropsTableCell type="prop">key</PropsTableCell>
            <PropsTableCell type="type">string</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">唯一标识符，用于 React key</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">id</PropsTableCell>
            <PropsTableCell type="type">string</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">数据项的 ID</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">customerItem</PropsTableCell>
            <PropsTableCell type="type">ReactNode</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">自定义轮播项内容</PropsTableCell>
          </PropsTableRow>
        </PropsTable>
        
        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
{`// Carousel 组件 Props
interface CarouselProps {
  onChange: (index: number) => void;         // 必填：切换回调函数
  dataList: ImgListType[];                   // 必填：轮播数据列表
}

// 轮播数据项结构
interface ImgListType {
  key: string;                               // 必填：唯一标识符
  id: string;                                // 必填：数据项 ID
  customerItem: ReactNode;                   // 必填：自定义内容
}

// 使用示例
const handleCarouselChange = (index: number) => {
  console.log('当前页面索引:', index)
}

<Carousel 
  dataList={yourDataList}
  onChange={handleCarouselChange}
/>`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>移动端优化</strong>：专为移动端设计，支持触摸滑动操作</li>
              <li><strong>流畅动画</strong>：内置缓动动画，提供流畅的切换体验</li>
              <li><strong>进度指示</strong>：底部进度条实时显示当前位置</li>
              <li><strong>自定义内容</strong>：支持任意 React 组件作为轮播项内容</li>
              <li><strong>边界处理</strong>：到达边界时自动停止滑动</li>
              <li><strong>单项优化</strong>：单个项目时自动隐藏进度条和滑动功能</li>
              <li><strong>响应式设计</strong>：自动适应容器宽度</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default CarouselDemo