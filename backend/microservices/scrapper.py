import os
import requests
import time
import zmq
import json
import random
from dotenv import load_dotenv
from pprint import pprint


def main():
    load_dotenv()

    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5566")

    proxies_list = ['dc.oxylabs.io:8001', 'dc.oxylabs.io:8002', 'dc.oxylabs.io:8003', 'dc.oxylabs.io:8004', 'dc.oxylabs.io:8005',
                    'dc.oxylabs.io:8006', 'dc.oxylabs.io:8007', 'dc.oxylabs.io:8008', 'dc.oxylabs.io:8009', 'dc.oxylabs.io:8010']

    try:
        while True:
            if socket.poll(1000):

                url = socket.recv().decode('utf-8')

                time.sleep(1)
                prox = random.choice(proxies_list)
                proxies = {
                    "http": f'http://{os.getenv("PROXY_USERNAME")}:{os.getenv("PROXY_PASSWORD")}@{prox}',
                    "https": f'https://{os.getenv("PROXY_USERNAME")}:{os.getenv("PROXY_PASSWORD")}@{prox}'
                }
                pprint(f"Proxies {proxies}")
                payload = {
                    'source': 'amazon',
                    'url': url,
                    'parse': True,
                    'geo_location': '90011'
                }
                headers = {
                    'x-oxylabs-user-agent-type': 'desktop_chrome',
                    'x-oxylabs-geo-location': 'United States',
                }

                response = requests.request(
                    'POST',
                    'https://realtime.oxylabs.io/v1/queries',
                    headers=headers,
                    auth=(os.getenv("AMAZON_API_USERNAME"),
                          os.getenv("AMAZON_API_PASSWORD")),
                    json=payload, proxies=proxies, verify=False, timeout=15
                )

                res = response.json()

                price = res['results'][0]['content'].get('price', 0)
                discount = res['results'][0]['content'].get(
                    'discount_percentage', 0)
                image = res['results'][0]['content'].get('images', [None])[
                    0]
                product_name = res['results'][0]['content'].get(
                    'product_name', "")
                asin = res['results'][0]['content'].get('asin_in_url', '')
                result = {
                    "price": price,
                    "discount": discount,
                    "image": image,
                    "product_name": product_name,
                    "asin": asin
                }

                result_json = json.dumps(result)

                socket.send(result_json.encode('utf-8'))

    except KeyboardInterrupt:
        print("Scrapper is shutting down")
    finally:
        socket.close()
        print("Socket Closed")


if __name__ == "__main__":
    main()
