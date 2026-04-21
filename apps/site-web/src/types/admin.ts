export interface AdminUserListItem {
  user_id: number
  username?: string
  nickname?: string | null
  avatar_url?: string | null
  phone_masked?: string
  has_phone: boolean
  has_apple: boolean
  is_active: boolean
  role: number
  role_name?: string
  register_source?: string
  subscription_active: boolean
  available_points: number
  created_at: number
  updated_at: number
}

export interface AdminUserListResponse {
  items: AdminUserListItem[]
  total: number
  page: number
  page_size: number
}

export interface AdminUserListParams {
  keyword?: string
  role?: number
  is_active?: boolean
  register_source?: string
  page?: number
  page_size?: number
}

export interface AdminBillingOrderItem {
  id: number
  user_id: number
  order_no: string
  product_code: string
  product_type: string
  platform: string
  channel: string
  status: string
  amount: number
  currency: string
  transaction_id: string
  original_transaction_id: string
  purchased_at?: number | null
  verified_at?: number | null
  created_at: number
}

export interface AdminBillingOrderListResponse {
  items: AdminBillingOrderItem[]
  total: number
  page: number
  page_size: number
}

export interface AdminBillingOrderListParams {
  page?: number
  page_size?: number
  user_id?: number
  status?: string
  product_type?: string
}

export interface AdminBillingOrderDetailResponse {
  id: number
  order_no: string
  user_id: number
  status: string
  product_code: string
  product_type: string
  platform: string
  channel: string
  amount: number
  currency: string
  transaction_id?: string
  original_transaction_id?: string
  created_at: number
  purchased_at?: number | null
  verified_at?: number | null
  user_snapshot?: Record<string, unknown>
  product_snapshot?: Record<string, unknown>
  verify_message?: string
  refund_state?: string
  reclaim_state?: string
  meta?: Record<string, unknown>
}

export interface AdminBillingProductItem {
  id: number
  product_code: string
  product_type: string
  platform: string
  display_name: string
  description?: string | null
  status: string
  price_amount: number
  currency: string
  point_amount: number
  period_unit: string
  period_count: number
  benefits?: Record<string, unknown>
  extra?: Record<string, unknown>
  sort: number
  created_at: number
  updated_at: number
}

export interface AdminBillingProductListResponse {
  items: AdminBillingProductItem[]
}

export interface AdminUpsertBillingProductPayload {
  product_code: string
  product_type: string
  platform: string
  display_name: string
  description?: string | null
  status: string
  price_amount: number
  currency: string
  point_amount: number
  period_unit: string
  period_count: number
  benefits?: Record<string, unknown>
  extra?: Record<string, unknown>
  sort: number
}

export interface AdminBillingWalletResponse {
  user_id: number
  available_points: number
  frozen_points: number
  current_subscription: string
  subscription_active: boolean
  subscription_expired_at?: number | null
  current_period_used: number
  point_discount_rate: number
  can_use_1080p: boolean
  can_remove_watermark: boolean
  can_use_priority_queue: boolean
  can_use_custom_aspect_ratio: boolean
  daily_free_remain: number
  daily_duration_remain_sec: number
}

export interface AdminPointLedgerItem {
  id: number
  change_type: string
  direction: string
  points: number
  biz_type: string
  biz_id: string
  remark?: string
  extra?: Record<string, unknown>
  display_title: string
  display_description?: string
  display_category: string
  display_points_text: string
  balance_after: number
  frozen_after: number
  created_at: number
}

export interface AdminPointLedgerListResponse {
  items: AdminPointLedgerItem[]
  total: number
  page: number
  page_size: number
}

export interface AdminPointLedgerListParams {
  page?: number
  page_size?: number
  change_type?: string
}

export interface AdminAdjustPointsResponse {
  user_id: number
  available_points: number
  frozen_points: number
}

export interface AdminUserDetailResponse {
  basic: {
    user_id: number
    username?: string
    nickname?: string | null
    avatar_url?: string | null
    phone_masked?: string
    email_masked?: string
    is_active: boolean
    role: number
    role_name?: string
    created_at: number
    updated_at: number
  }
  auth: {
    has_phone: boolean
    has_apple: boolean
    has_password: boolean
    bound_login_methods: string[]
    preferred_login_method?: string
    register_source?: string
  }
  billing: {
    subscription_active: boolean
    current_subscription?: string
    subscription_expired_at?: number | null
    available_points: number
    frozen_points: number
    point_discount_rate: number
  }
  security: {
    can_bind_phone: boolean
    can_bind_apple: boolean
    can_unbind_apple: boolean
  }
}

export interface AdminUserDeviceItem {
  id: number
  device_id: string
  device_type: string
  device_name?: string
  os?: string
  app_version?: string
  last_login_at: number
  last_login_ip?: string
  is_blocked: boolean
  created_at: number
  updated_at: number
}

export interface AdminUserDeviceListResponse {
  user_id: number
  items: AdminUserDeviceItem[]
}

export interface AdminUserStatusResponse {
  user_id: number
  is_active?: boolean
  role?: number
  message?: string
}

export interface AdminForceLogoutResponse {
  user_id: number
  logged_out_devices: number
  message?: string
}

export interface AdminUnbindAuthResponse {
  success: boolean
  message?: string
}
