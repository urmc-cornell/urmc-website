from scripts import fetch_data_from_google_sheets, insert_data_into_postgresql, create_table_if_not_exists, full_url

# Test 1: Fetch data from Google Sheets
def test_fetch():
    rows = fetch_data_from_google_sheets(full_url)
    print("Fetched rows:", len(rows))
    print("Sample data:", rows[0] if rows else "No data found")
    return rows

# Test 2: Database connection
def test_db_connection():
    import psycopg2
    from scripts import db_config
    try:
        conn = psycopg2.connect(**db_config)
        print("Database connection successful!")
        conn.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

# Run tests 
if __name__ == "__main__":
    print("Creating table if it doesn't exist...")
    create_table_if_not_exists()
    
    print("=== Testing Google Sheets Fetch ===")
    rows = test_fetch()
    
    print("\n=== Testing Database Connection ===")
    test_db_connection()
    
    if rows:
        print("\n=== Testing Data Insertion ===")
        insert_data_into_postgresql(rows)