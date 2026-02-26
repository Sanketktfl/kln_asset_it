from cs.platform.web import JsonAPI
from cs.platform.web.root import Internal
from cdb import sqlapi, misc
from datetime import datetime

class AssetItScanAPI(JsonAPI):
    pass

@Internal.mount(app=AssetItScanAPI, path="asset_it_scan")
def _mount_app():
    return AssetItScanAPI()

class AssetItScanData:
    def create_item(self, data):
        try:
            barcode = data.get("barcode")
            rfid = data.get("rfid")
            plant_code = data.get("plant_code")
            department = data.get("department")
            date_time = data.get("date_time")

            if date_time:
                date_time = datetime.strptime(date_time, "%Y-%m-%d").strftime("%Y-%m-%d")

            # generate object id
            object_id = misc.UUID(create=True)

            sqlapi.SQLexecute("""
                INSERT INTO kln_asset_scan
                (
                    cdb_object_id,
                    barcode,
                    rfid,
                    plant_code,
                    department,
                    date_time,
                    is_scanned
                )
                VALUES
                (
                    '%s',
                    '%s',
                    '%s',
                    %d,
                    '%s',
                    '%s',
                    0
                )
            """ % (
                object_id,
                barcode,
                rfid,
                plant_code,
                department,
                date_time
            ))

            return {
                "status": "success",
                "message": "Inserted successfully"
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

@AssetItScanAPI.path(model=AssetItScanData, path="")
def _path():
    return AssetItScanData()

@AssetItScanAPI.json(model=AssetItScanData, request_method="POST")
def _create_item(model, request):
    return model.create_item(request.json)
