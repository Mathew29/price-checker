import os
import requests
import time
import zmq
import json
from dotenv import load_dotenv
from pprint import pprint


def main():
    load_dotenv()

    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5566")
    try:
        while True:
            if socket.poll(1000):

                url = socket.recv().decode('utf-8')

                time.sleep(1)
                payload = {
                    'source': 'amazon',
                    'url': url,
                    'parse': True
                }

                response = requests.request(
                    'POST',
                    'https://realtime.oxylabs.io/v1/queries',
                    auth=(os.getenv("AMAZON_API_USERNAME"),
                          os.getenv("AMAZON_API_PASSWORD")),
                    json=payload
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
