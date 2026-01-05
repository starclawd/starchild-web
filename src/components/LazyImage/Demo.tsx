import { memo, useState } from 'react'
import styled from 'styled-components'
import LazyImage from './index'

const DemoContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`

const DemoSection = styled.div`
  margin-bottom: 60px;

  h2 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.black0};
  }

  h3 {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 16px;
    margin-top: 32px;
    color: ${({ theme }) => theme.black0};
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.black200};
    margin-bottom: 24px;
  }
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const ImageCard = styled.div`
  background: ${({ theme }) => theme.bgL1};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const ImageInfo = styled.div`
  padding: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.black100};
`

const ScrollContainer = styled.div`
  height: 400px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL0};
`

const BackgroundImageExample = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const BackgroundCard = styled.div`
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL0};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
`

const LazyImageDemo = memo(function LazyImageDemo() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }

  // 示例图片数组
  const sampleImages = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5',
    'https://picsum.photos/400/300?random=6',
    'https://picsum.photos/400/300?random=7',
    'https://picsum.photos/400/300?random=8',
    'https://picsum.photos/400/300?random=9',
    'https://picsum.photos/400/300?random=10',
  ]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>LazyImage 图片懒加载组件</h2>
        <p>
          LazyImage 组件使用 IntersectionObserver API 实现图片懒加载，
          只有当图片进入视口或即将进入视口时才开始加载，有效提升页面性能。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最基本的懒加载图片展示，当图片进入视口时自动加载</p>

        <ImageGrid>
          {sampleImages.slice(0, 4).map((src, index) => (
            <ImageCard key={index}>
              <LazyImage
                src={src}
                width='100%'
                height={200}
                alt={`Sample ${index + 1}`}
                onLoad={() => handleImageLoad(`basic-${index}`)}
              />
              <ImageInfo>{loadedImages.has(`basic-${index}`) ? '✅ 已加载' : '⏳ 等待加载'}</ImageInfo>
            </ImageCard>
          ))}
        </ImageGrid>

        <CodeBlock>
          {`<LazyImage
  src="image-url.jpg"
  width="100%"
  height={200}
  alt="Description"
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>背景图片模式</h3>
        <p>使用 asBackground 属性将图片作为背景图片加载</p>

        <BackgroundImageExample>
          {sampleImages.slice(4, 7).map((src, index) => (
            <BackgroundCard key={index}>
              <LazyImage
                src={src}
                asBackground
                width='100%'
                height='100%'
                onLoad={() => handleImageLoad(`bg-${index}`)}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                {loadedImages.has(`bg-${index}`) ? '✅ 背景已加载' : '⏳ 等待加载'}
              </div>
            </BackgroundCard>
          ))}
        </BackgroundImageExample>

        <CodeBlock>
          {`<LazyImage
  src="background.jpg"
  asBackground
  width="100%"
  height={200}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>滚动加载示例</h3>
        <p>在滚动容器中的图片懒加载，只有滚动到可视区域时才加载</p>

        <ScrollContainer>
          <p style={{ marginBottom: '20px' }}>👇 向下滚动查看更多图片</p>
          {sampleImages.map((src, index) => (
            <ImageCard key={index} style={{ marginBottom: '20px' }}>
              <LazyImage
                src={src}
                width='100%'
                height={150}
                alt={`Scroll ${index + 1}`}
                threshold={50}
                onLoad={() => handleImageLoad(`scroll-${index}`)}
              />
              <ImageInfo>
                图片 {index + 1}: {loadedImages.has(`scroll-${index}`) ? '✅ 已加载' : '⏳ 等待加载'}
              </ImageInfo>
            </ImageCard>
          ))}
        </ScrollContainer>
      </DemoSection>

      <DemoSection>
        <h3>加载失败处理</h3>
        <p>当图片加载失败时，自动显示备用图片</p>

        <ImageGrid>
          <ImageCard>
            <LazyImage
              src='https://invalid-image-url.jpg'
              width='100%'
              height={200}
              alt='Failed image'
              onError={() => console.log('图片加载失败')}
            />
            <ImageInfo>加载失败示例</ImageInfo>
          </ImageCard>
        </ImageGrid>

        <CodeBlock>
          {`<LazyImage
  src="invalid-url.jpg"
  fallbackSrc="/default-image.png"
  onError={() => console.log('加载失败')}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义加载阈值</h3>
        <p>通过 threshold 和 rootMargin 自定义触发加载的时机</p>

        <CodeBlock>
          {`// 提前 200px 开始加载
<LazyImage
  src="image.jpg"
  threshold={200}
  rootMargin="200px"
/>

// 完全进入视口才加载
<LazyImage
  src="image.jpg"
  threshold={0}
  rootMargin="0px"
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>API 参数说明</h3>
        <div
          style={{
            background: `${({ theme }: any) => theme.bgL0}`,
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 100px 100px 1fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 'bold',
            }}
          >
            <div>参数</div>
            <div>类型</div>
            <div>默认值</div>
            <div>说明</div>
          </div>

          {[
            ['src', 'string', '-', '图片URL地址'],
            ['fallbackSrc', 'string', 'default.png', '加载失败时的备用图片'],
            ['width', 'string | number', '100%', '图片宽度'],
            ['height', 'string | number', '100%', '图片高度'],
            ['asBackground', 'boolean', 'false', '是否作为背景图片'],
            ['threshold', 'number', '100', '触发加载的距离阈值(px)'],
            ['rootMargin', 'string', '100px', 'IntersectionObserver的rootMargin'],
            ['showSkeleton', 'boolean', 'true', '是否显示骨架屏动画'],
            ['onLoad', 'function', '-', '图片加载成功回调'],
            ['onError', 'function', '-', '图片加载失败回调'],
          ].map(([param, type, defaultValue, description], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 100px 100px 1fr',
                gap: '15px',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index === 9 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>{param}</div>
              <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#95a5a6' }}>{defaultValue}</div>
              <div>{description}</div>
            </div>
          ))}
        </div>
      </DemoSection>
    </DemoContainer>
  )
})

export default LazyImageDemo
