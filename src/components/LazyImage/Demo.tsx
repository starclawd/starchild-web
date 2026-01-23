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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.bgL1};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .feature-content {
    padding: 16px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${({ theme }) => theme.black0};
    }
    
    p {
      font-size: 13px;
      color: ${({ theme }) => theme.black300};
      margin: 0;
    }
  }
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
          LazyImage 是一个功能丰富的图片懒加载组件，使用 IntersectionObserver API 实现，
          支持骨架屏、模糊占位、失败重试、自动降级等高级功能，有效提升页面性能和用户体验。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>🚀 基础用法</h3>
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
        <h3>🎨 Object-Fit 模式</h3>
        <p>支持多种 object-fit 模式：cover、contain、fill、none、scale-down</p>

        <FeatureGrid>
          {(['cover', 'contain', 'fill', 'scale-down'] as const).map((fit, index) => (
            <FeatureCard key={fit}>
              <LazyImage
                src={sampleImages[index]}
                width='100%'
                height={150}
                objectFit={fit}
                alt={`Object-fit: ${fit}`}
              />
              <div className='feature-content'>
                <h4>objectFit: "{fit}"</h4>
                <p>{fit === 'cover' ? '默认值，保持比例填充' : fit === 'contain' ? '保持比例，完整显示' : fit === 'fill' ? '拉伸填充，可能变形' : '缩小以适应容器'}</p>
              </div>
            </FeatureCard>
          ))}
        </FeatureGrid>

        <CodeBlock>
          {`<LazyImage
  src="image.jpg"
  objectFit="contain"  // 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  objectPosition="center"  // 'center' | 'top' | 'bottom' | 'left' | 'right' | 自定义
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>📐 宽高比与圆角</h3>
        <p>使用 aspectRatio 和 borderRadius 控制图片尺寸和形状</p>

        <FeatureGrid>
          <FeatureCard>
            <LazyImage
              src={sampleImages[0]}
              width='100%'
              aspectRatio='16/9'
              borderRadius={12}
              alt='16:9 aspect ratio'
            />
            <div className='feature-content'>
              <h4>aspectRatio: "16/9"</h4>
              <p>宽高比 16:9，常用于视频封面</p>
            </div>
          </FeatureCard>
          
          <FeatureCard>
            <LazyImage
              src={sampleImages[1]}
              width='100%'
              aspectRatio='1/1'
              borderRadius='50%'
              alt='1:1 aspect ratio, circular'
            />
            <div className='feature-content'>
              <h4>aspectRatio: "1/1" + 圆形</h4>
              <p>正方形宽高比配合圆形裁剪</p>
            </div>
          </FeatureCard>
          
          <FeatureCard>
            <LazyImage
              src={sampleImages[2]}
              width='100%'
              aspectRatio='4/3'
              borderRadius={24}
              alt='4:3 aspect ratio'
            />
            <div className='feature-content'>
              <h4>aspectRatio: "4/3"</h4>
              <p>宽高比 4:3，大圆角</p>
            </div>
          </FeatureCard>
        </FeatureGrid>

        <CodeBlock>
          {`// 使用宽高比
<LazyImage
  src="image.jpg"
  width="100%"
  aspectRatio="16/9"
  borderRadius={12}
/>

// 圆形头像
<LazyImage
  src="avatar.jpg"
  width={80}
  aspectRatio="1/1"
  borderRadius="50%"
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>🔄 失败重试</h3>
        <p>支持加载失败后自动重试，并最终降级到 fallback 图片</p>

        <ImageGrid>
          <ImageCard>
            <LazyImage
              src='https://invalid-image-url-that-will-fail.jpg'
              fallbackSrc={sampleImages[0]}
              width='100%'
              height={200}
              retryCount={2}
              retryDelay={1000}
              alt='Failed image with retry'
              onError={() => console.log('图片加载失败，已重试')}
            />
            <ImageInfo>失败重试示例 (retryCount: 2)</ImageInfo>
          </ImageCard>
        </ImageGrid>

        <CodeBlock>
          {`<LazyImage
  src="may-fail.jpg"
  fallbackSrc="/default.png"
  retryCount={3}        // 失败后最多重试 3 次
  retryDelay={1000}     // 每次重试间隔 1 秒
  loadingTimeout={5000} // 5 秒超时
  onError={() => console.log('加载失败')}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>⚡ 立即加载 (Eager)</h3>
        <p>使用 eager 属性禁用懒加载，图片会立即开始加载</p>

        <ImageGrid>
          <ImageCard>
            <LazyImage
              src={sampleImages[5]}
              width='100%'
              height={200}
              eager
              alt='Eager loading'
              onLoad={() => handleImageLoad('eager-0')}
            />
            <ImageInfo>{loadedImages.has('eager-0') ? '✅ 已立即加载' : '⏳ 加载中...'}</ImageInfo>
          </ImageCard>
        </ImageGrid>

        <CodeBlock>
          {`// 禁用懒加载，立即加载图片
<LazyImage
  src="important-image.jpg"
  eager
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>🎭 自定义动画</h3>
        <p>自定义淡入动画的时长和缓动函数</p>

        <FeatureGrid>
          <FeatureCard>
            <LazyImage
              src={sampleImages[6]}
              width='100%'
              height={150}
              transitionDuration={0.3}
              transitionTimingFunction='ease-out'
              alt='Fast transition'
            />
            <div className='feature-content'>
              <h4>快速淡入</h4>
              <p>duration: 0.3s, ease-out</p>
            </div>
          </FeatureCard>
          
          <FeatureCard>
            <LazyImage
              src={sampleImages[7]}
              width='100%'
              height={150}
              transitionDuration={1}
              transitionTimingFunction='ease-in-out'
              alt='Slow transition'
            />
            <div className='feature-content'>
              <h4>缓慢淡入</h4>
              <p>duration: 1s, ease-in-out</p>
            </div>
          </FeatureCard>
        </FeatureGrid>

        <CodeBlock>
          {`<LazyImage
  src="image.jpg"
  transitionDuration={0.5}
  transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>🖼️ 背景图片模式</h3>
        <p>使用 asBackground 属性将图片作为背景图片加载，支持叠加内容</p>

        <BackgroundImageExample>
          {sampleImages.slice(4, 7).map((src, index) => (
            <BackgroundCard key={index}>
              <LazyImage
                src={src}
                asBackground
                width='100%'
                height='100%'
                onLoad={() => handleImageLoad(`bg-${index}`)}
              >
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
              </LazyImage>
            </BackgroundCard>
          ))}
        </BackgroundImageExample>

        <CodeBlock>
          {`<LazyImage
  src="background.jpg"
  asBackground
  width="100%"
  height={200}
>
  <OverlayContent>可以在背景图上叠加内容</OverlayContent>
</LazyImage>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>📜 滚动加载示例</h3>
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
                borderRadius={8}
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
        <h3>📖 完整 API 参数说明</h3>
        <div
          style={{
            background: `rgba(0, 0, 0, 0.3)`,
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 150px 120px 1fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 'bold',
              minWidth: '600px',
            }}
          >
            <div>参数</div>
            <div>类型</div>
            <div>默认值</div>
            <div>说明</div>
          </div>

          {[
            ['src', 'string', '-', '图片 URL 地址'],
            ['fallbackSrc', 'string', 'default.png', '加载失败时的备用图片'],
            ['width', 'string | number', '100%', '图片宽度'],
            ['height', 'string | number', '100%', '图片高度'],
            ['aspectRatio', 'string', '-', '宽高比 (如 "16/9", "4/3")'],
            ['borderRadius', 'string | number', '0', '圆角 (px 或 CSS 值)'],
            ['objectFit', 'ObjectFitType', 'cover', 'cover/contain/fill/none/scale-down'],
            ['objectPosition', 'string', 'center', '图片位置 (center/top/bottom 等)'],
            ['asBackground', 'boolean', 'false', '是否作为背景图片'],
            ['eager', 'boolean', 'false', '是否立即加载（禁用懒加载）'],
            ['threshold', 'number', '100', '触发加载的距离阈值 (px)'],
            ['rootMargin', 'string', 'threshold px', 'IntersectionObserver 的 rootMargin'],
            ['showSkeleton', 'boolean', 'true', '是否显示骨架屏动画'],
            ['skeletonColor', 'string', 'theme.black900', '骨架屏背景色'],
            ['skeletonHighlightColor', 'string', 'theme.black800', '骨架屏高亮色'],
            ['showLoading', 'boolean', 'false', '是否显示加载 Spinner'],
            ['loadingComponent', 'ReactNode', '-', '自定义加载组件'],
            ['retryCount', 'number', '0', '失败重试次数'],
            ['retryDelay', 'number', '1000', '重试间隔 (ms)'],
            ['loadingTimeout', 'number', '-', '加载超时时间 (ms)'],
            ['errorComponent', 'ReactNode', '-', '自定义错误组件'],
            ['blurPreview', 'boolean', 'false', '是否显示模糊占位效果'],
            ['lowQualitySrc', 'string', '-', '低质量占位图 URL (LQIP)'],
            ['transitionDuration', 'number', '0.3', '淡入动画时长 (秒)'],
            ['transitionTimingFunction', 'string', 'ease-in-out', '动画缓动函数'],
            ['srcSet', 'string', '-', '响应式图片 srcSet'],
            ['sizes', 'string', '-', '响应式图片 sizes'],
            ['crossOrigin', 'string', '-', '跨域设置'],
            ['onLoad', '() => void', '-', '图片加载成功回调'],
            ['onError', '(error) => void', '-', '图片加载失败回调'],
            ['placeholder', 'ReactNode', '-', '自定义占位符'],
            ['children', 'ReactNode', '-', '子内容（背景模式下叠加）'],
          ].map(([param, type, defaultValue, description], index, arr) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 150px 120px 1fr',
                gap: '15px',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index === arr.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                minWidth: '600px',
              }}
            >
              <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>{param}</div>
              <div style={{ fontFamily: 'monospace', color: '#4ecdc4', fontSize: '12px' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#95a5a6', fontSize: '12px' }}>{defaultValue}</div>
              <div style={{ fontSize: '13px' }}>{description}</div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection>
        <h3>💡 最佳实践</h3>
        
        <CodeBlock>
          {`// 1. 基础懒加载图片
<LazyImage
  src="image.jpg"
  width="100%"
  height={200}
  fallbackSrc="/placeholder.png"
/>

// 2. 头像组件
<LazyImage
  src={user.avatar}
  width={48}
  aspectRatio="1/1"
  borderRadius="50%"
  objectFit="cover"
  eager  // 头像通常需要立即显示
/>

// 3. 卡片封面图
<LazyImage
  src={card.coverImage}
  width="100%"
  aspectRatio="16/9"
  borderRadius={12}
  objectFit="cover"
  showSkeleton
/>

// 4. 高可靠性图片（带重试）
<LazyImage
  src={importantImage}
  fallbackSrc="/fallback.png"
  retryCount={3}
  retryDelay={2000}
  loadingTimeout={10000}
  onError={(e) => reportError(e)}
/>

// 5. 背景图片带叠加内容
<LazyImage
  src={hero.background}
  asBackground
  width="100%"
  height={400}
  objectFit="cover"
>
  <HeroContent>
    <Title>Welcome</Title>
  </HeroContent>
</LazyImage>`}
        </CodeBlock>
      </DemoSection>
    </DemoContainer>
  )
})

export default LazyImageDemo
