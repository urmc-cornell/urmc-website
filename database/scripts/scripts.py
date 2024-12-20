import requests
import psycopg2
import json

# Google Sheets configuration
sheet_id = "1Gmj6r89FF-QDD4NbBRG7nXKXjcQGUZbO6ddVM359H6k"
sheet_title = "Points"
sheet_range = 'A2:C200'
full_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?sheet={sheet_title}&range={sheet_range}"

# PostgreSQL configuration
db_config = {
    'dbname': 'urmcDB',
    'user': 'charlesliggins',
    'password': 'Unomas63',
    'host': 'localhost',
    'port': '5432'
}

# GET REQUEST FROM GOOGLE SHEETS 
def fetch_data_from_google_sheets(url):
    response = requests.get(url)
    if response.status_code == 200:
        # Parse the JSON response
        json_data = response.text[47:-2]  # Remove the prefix and suffix
        data = json.loads(json_data)['table']['rows']
        
        # Add validation and logging
        print(f"Retrieved {len(data)} rows from Google Sheets")
        if data:
            # Print sample of first row
            print("\nSample data (first row):")
            first_row = [cell['v'] if 'v' in cell else None for cell in data[0]['c']]
            print(first_row)
            
            # Validate data structure
            for i, row in enumerate(data):
                if not isinstance(row, dict) or 'c' not in row:
                    print(f"Warning: Invalid row structure at index {i}")
                    continue
                values = [cell['v'] if 'v' in cell else None for cell in row['c']]
                if len(values) != 3:  # Expecting 3 columns
                    print(f"Warning: Row {i} has {len(values)} columns instead of 3")
        return data
    else:
        print(f"Error fetching data: {response.status_code}")
        return []

# POST REQUEST INTO DATABASE
def insert_data_into_postgresql(rows):
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        # Insert data into PostgreSQL
        for row in rows:
            values = [cell['v'] if 'v' in cell else None for cell in row['c']]
            query = 'INSERT INTO points_table (column1, column2, column3) VALUES (%s, %s, %s)'
            cursor.execute(query, values)

        # Commit the transaction
        conn.commit()
        print("Data imported successfully")
    except Exception as e:
        print(f"Error inserting data: {e}")
    finally:
        cursor.close()
        conn.close()

def create_table_if_not_exists():
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        
        create_table_query = '''
        CREATE TABLE IF NOT EXISTS points_table (
            id SERIAL PRIMARY KEY,
            student VARCHAR(255),
            netid VARCHAR(255),
            points INTEGER
        );
        '''
        
        cursor.execute(create_table_query)
        conn.commit()
        print("Table created successfully")
        
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    print("Creating table if it doesn't exist...")
    create_table_if_not_exists()
    
    print("Starting data fetch...")
    rows = fetch_data_from_google_sheets(full_url)
    
    if rows:
        print("\nProceeding to database insertion...")
        insert_data_into_postgresql(rows)
    else:
        print("No data to insert into database")