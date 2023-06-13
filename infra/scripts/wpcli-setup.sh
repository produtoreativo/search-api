#!/bin/sh
sleep 20
wp core install --url="http://localhost:8000" --title="Wordpress By Docker" --admin_user=admin --admin_password=admin --admin_email=admin@admin.com
wp plugin install woocommerce --activate --allow-root
wp wc tool run install_pages --user=admin --allow-root
