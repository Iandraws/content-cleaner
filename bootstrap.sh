apt update
apt upgrade


add-apt-repository ppa:deadsnakes/ppa -y

apt install python3.13 -y
apt install python3.13-venv -y
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3.13 get-pip.py


python3.13 -m venv content-cleaner-env
source content-cleaner-env/bin/activate

# Solve manual pip install permission issues
chown -R vagrant:vagrant /home/vagrant/content-cleaner-env

pip install fastapi uvicorn pydantic python-dotenv asyncpg python-jose slowapi



# Postgres
# Install PostgreSQL
apt install -y postgresql
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE cleaner;"
sudo -u postgres psql -d cleaner -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

echo "Creating database table..."
sudo -u postgres psql -d cleaner -c "CREATE TABLE api_keys (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), api_key VARCHAR NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP, plan_type VARCHAR NOT NULL DEFAULT 'free', CONSTRAINT unique_api_key UNIQUE (api_key));"

echo "Adding keys..."
sudo -u postgres psql -d cleaner -c "INSERT INTO api_keys (id, api_key, expires_at, plan_type) VALUES (uuid_generate_v4(), '12345678-ABCD-APIKEY-FREE', NOW() + INTERVAL '365 days', 'free');"
sudo -u postgres psql -d cleaner -c "INSERT INTO api_keys (id, api_key, expires_at, plan_type) VALUES (uuid_generate_v4(), '12345678-ABCD-APIKEY-PAYGO', NOW() + INTERVAL '365 days', 'paygo');"


echo "Creating Private/Public keys"
openssl genrsa -out /var/www/content-cleaner/app/private.pem 2048
openssl rsa -in /var/www/content-cleaner/app/private.pem -pubout -out /var/www/content-cleaner/app/public.pem
