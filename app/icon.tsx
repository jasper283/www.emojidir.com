import { ImageResponse } from 'next/og'

// 图像元数据
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 图像生成
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
        }}
      >
        😀
      </div>
    ),
    {
      ...size,
    }
  )
}

