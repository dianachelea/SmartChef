import sys
import json
import os
from ultralytics import YOLO

def detect_all_objects(image_path):
    all_detected = set()
    models = [
        "best_general.pt",
        "best_special.pt",
    ]

    for model_filename in models:
        model_path = os.path.join(os.path.dirname(__file__), model_filename)
        model = YOLO(model_path)

        results = model.predict(image_path, conf=0.01, iou=0.4)
        names = model.names

        for r in results:
            for box in r.boxes:
                cls = int(box.cls)
                label = names[cls]
                all_detected.add(label)

    print(json.dumps(sorted(all_detected)))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Lipseste calea catre imagine.")
    detect_all_objects(sys.argv[1])
