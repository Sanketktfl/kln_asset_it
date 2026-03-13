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
            barcode = data.get("barcode", "").strip() if data.get("barcode") else ""
            rfid = data.get("rfid", "").strip() if data.get("rfid") else ""
            plant_code = data.get("plant_code")
            department = data.get("department")
            date_time = data.get("date_time")

            # ── Require at least one of rfid or barcode ──────────
            if not rfid and not barcode:
                return {"status": "error", "message": "At least one of RFID or Barcode is required"}

            if date_time:
                date_time = datetime.strptime(date_time, "%Y-%m-%d").strftime("%Y-%m-%d")

            # ── Duplicate check — independent per field ──
            if rfid:
                rfid_check = sqlapi.RecordSet2(sql="""
                    SELECT cdb_object_id FROM kln_asset_scan
                    WHERE rfid = '%s'
                """ % rfid)
                if list(rfid_check):
                    return {"status": "error",
                            "message": "A record with this RFID already exists in the scan table."}

            if barcode:
                barcode_check = sqlapi.RecordSet2(sql="""
                    SELECT cdb_object_id FROM kln_asset_scan
                    WHERE barcode = '%s'
                """ % barcode)
                if list(barcode_check):
                    return {"status": "error",
                            "message": "A record with this Barcode already exists in the scan table."}


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

            return {"status": "success", "message": "Inserted successfully"}

        except Exception as e:
            return {"status": "error", "message": str(e)}

@AssetItScanAPI.path(model=AssetItScanData, path="")
def _path():
    return AssetItScanData()

@AssetItScanAPI.json(model=AssetItScanData, request_method="POST")
def _create_item(model, request):
    return model.create_item(request.json)
