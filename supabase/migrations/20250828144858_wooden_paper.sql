/*
  # 创建剪贴板条目表

  1. 新建表
    - `clipboard_entries`
      - `id` (uuid, 主键)
      - `content` (text, 内容)
      - `title` (text, 标题)
      - `created_at` (timestamp, 创建时间)
      - `updated_at` (timestamp, 更新时间)
      - `user_id` (uuid, 用户ID，可选)

  2. 安全设置
    - 启用 RLS (行级安全)
    - 添加策略允许所有用户读写数据（简化版本，生产环境建议添加用户认证）
*/

CREATE TABLE IF NOT EXISTS clipboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid DEFAULT NULL
);

-- 启用行级安全
ALTER TABLE clipboard_entries ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有用户读取数据
CREATE POLICY "Anyone can read clipboard entries"
  ON clipboard_entries
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 创建策略：允许所有用户插入数据
CREATE POLICY "Anyone can insert clipboard entries"
  ON clipboard_entries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 创建策略：允许所有用户更新数据
CREATE POLICY "Anyone can update clipboard entries"
  ON clipboard_entries
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 创建策略：允许所有用户删除数据
CREATE POLICY "Anyone can delete clipboard entries"
  ON clipboard_entries
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_clipboard_entries_created_at 
  ON clipboard_entries(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clipboard_entries_updated_at 
  BEFORE UPDATE ON clipboard_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();