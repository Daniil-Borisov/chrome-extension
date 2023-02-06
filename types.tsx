export type AuthContextType = {
  setAuth: (user: unknown) => void
  auth: {
    photoURL?: string
    displayName?: string
    email?: string
    uid?: string
  }
}

export type CommentPos = {
  x: number
  y: number
}

export type EmojiObject = {
  activeSkinTone: string
  emoji: string
  names: string[]
  originalUnified: string
  unified: string
}

export type GifObjectParam = {
  height: string
  width: string
  size: string
  url: string
  mp4: string
  mp4_size: string
}

export type GifObject = {
  '480w_still': GifObjectParam
  downsized: GifObjectParam
  downsized_large: GifObjectParam
  downsized_medium: GifObjectParam
  downsized_small: GifObjectParam
  downsized_still: GifObjectParam
  fixed_height: GifObjectParam
  fixed_height_downsampled: GifObjectParam
  fixed_height_small: GifObjectParam
  fixed_height_small_still: GifObjectParam
  fixed_height_still: GifObjectParam
  fixed_width:  GifObjectParam
  fixed_width_downsampled: GifObjectParam
  fixed_width_small: GifObjectParam
  fixed_width_small_still: GifObjectParam
  fixed_width_still: GifObjectParam
  looping: GifObjectParam
  original: GifObjectParam
  original_mp4: GifObjectParam
  original_still: GifObjectParam
  preview: GifObjectParam
  preview_gif: GifObjectParam
  preview_webp: GifObjectParam
}