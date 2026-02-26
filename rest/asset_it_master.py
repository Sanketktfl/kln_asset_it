from cs.platform.web import JsonAPI
from cs.platform.web.root import Internal
from cdb import sqlapi, misc
from datetime import datetime

class AssetMasterAPI(JsonAPI):
    pass

@Internal.mount(app=AssetMasterAPI, path="asset_it_master")
def _mount_app():
    return AssetMasterAPI()

class AssetMasterData:

    def create_item(self, data):
        try:
            object_id = misc.UUID(create=True)

            verified = data.get("verified_status")
            if verified:
                verified = datetime.strptime(verified, "%Y-%m-%d").strftime("%Y-%m-%d")

            sqlapi.SQLexecute("""
                INSERT INTO kln_asset_master
                (
                    cdb_object_id,
                    barcode_no,
                    rfid_no,
                    asset_no,
                    model_no,
                    serial_no,
                    plant,
                    location,
                    custodian,
                    mfg_year,
                    verified_status,
                    asset_status,
                    comments
                )
                VALUES
                (
                    '%s','%s','%s','%s','%s','%s',
                    '%s','%s','%s',%d,'%s','%s','%s'
                )
            """ % (
                object_id,
                data.get("barcode_no"),
                data.get("rfid_no"),
                data.get("asset_no"),
                data.get("model_no"),
                data.get("serial_no"),
                data.get("plant"),
                data.get("location"),
                data.get("custodian"),
                int(data.get("mfg_year") or 0),
                verified,
                data.get("asset_status"),
                data.get("comments") or ""
            ))

            return {"status": "success"}

        except Exception as e:
            return {"status": "error", "message": str(e)}

@AssetMasterAPI.path(model=AssetMasterData, path="")
def _path():
    return AssetMasterData()

@AssetMasterAPI.json(model=AssetMasterData, request_method="POST")
def _create(model, request):
    return model.create_item(request.json)