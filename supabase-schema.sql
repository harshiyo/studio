-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    company TEXT NOT NULL,
    container_size TEXT NOT NULL CHECK (container_size IN (
        '20ft Used (WWT)',
        '20ft Used (Cargo)',
        '20ft New',
        '40ft Used (WWT)',
        '40ft Used (Cargo)',
        '40ft New',
        '40ft HC Used (WWT)',
        '40ft HC Used (Cargo)',
        '40ft HC New'
    )),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on delivery_date for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read orders
CREATE POLICY "Allow public read access" ON orders
    FOR SELECT USING (true);

-- Create a policy that allows all users to insert orders
CREATE POLICY "Allow public insert access" ON orders
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows all users to update orders
CREATE POLICY "Allow public update access" ON orders
    FOR UPDATE USING (true);

-- Create a policy that allows all users to delete orders
CREATE POLICY "Allow public delete access" ON orders
    FOR DELETE USING (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
