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

    def get_all(self, plant=None):
        try:
            where = ""
            if plant:
                plant_safe = plant.replace("'", "''")
                where = f"WHERE plant = '{plant_safe}'"

            recordset = sqlapi.RecordSet2(sql=f"""
                SELECT
                    cdb_object_id, barcode_no, rfid_no, asset_no,
                    asset_code, asset_class, asset_desc,
                    model_no, serial_no, manufacturer,
                    mfg_year, base_of_unit, quantity,
                    plant, location, custodian,
                    company_code, cost_center,
                    acquis_val, capitalized_on, life,
                    internal_order_no, ecc_io_no,
                    verified_status, asset_status, comments
                FROM kln_asset_master
                {where}
                ORDER BY barcode_no
            """)

            objects = []
            for rec in recordset:
                row = {}
                for col in rec.keys():
                    val = rec[col]
                    # Convert datetime/date to string so JSON can serialize it
                    if hasattr(val, 'strftime'):
                        val = val.strftime("%Y-%m-%d")
                    row[col] = val
                objects.append(row)

            return {"status": "success", "count": len(objects), "objects": objects}

        except Exception as e:
            return {"status": "error", "message": str(e)}

    def create_item(self, data):
        try:
            object_id = misc.UUID(create=True)

            verified = data.get("verified_status")
            if verified:
                try:
                    verified = datetime.strptime(verified, "%Y-%m-%d").strftime("%Y-%m-%d")
                except ValueError:
                    verified = None

            capitalized_on = data.get("capitalized_on")
            if capitalized_on:
                try:
                    capitalized_on = datetime.strptime(capitalized_on, "%Y-%m-%d").strftime("%Y-%m-%d")
                except ValueError:
                    capitalized_on = None

            mfg_year = int(data.get("mfg_year") or 0)
            quantity = float(data.get("quantity") or 0.0)

            sqlapi.SQLexecute("""
                INSERT INTO kln_asset_master
                (
                    cdb_object_id,
                    barcode_no, rfid_no, asset_no,
                    asset_code, asset_class, asset_desc,
                    model_no, serial_no, manufacturer,
                    mfg_year, base_of_unit, quantity,
                    plant, location, custodian,
                    company_code, cost_center,
                    acquis_val, capitalized_on, life,
                    internal_order_no, ecc_io_no,
                    verified_status, asset_status, comments
                )
                VALUES
                (
                    '%s','%s','%s','%s',
                    '%s','%s','%s',
                    '%s','%s','%s',
                    %d,'%s',%f,
                    '%s','%s','%s',
                    '%s','%s',
                    '%s','%s','%s',
                    '%s','%s',
                    '%s','%s','%s'
                )
            """ % (
                object_id,
                data.get("barcode_no") or "",
                data.get("rfid_no") or "",
                data.get("asset_no") or "",
                data.get("asset_code") or "",
                data.get("asset_class") or "",
                data.get("asset_desc") or "",
                data.get("model_no") or "",
                data.get("serial_no") or "",
                data.get("manufacturer") or "",
                mfg_year,
                data.get("base_of_unit") or "",
                quantity,
                data.get("plant") or "",
                data.get("location") or "",
                data.get("custodian") or "",
                data.get("company_code") or "",
                data.get("cost_center") or "",
                data.get("acquis_val") or "",
                capitalized_on or "",
                data.get("life") or "",
                data.get("internal_order_no") or "",
                data.get("ecc_io_no") or "",
                verified or "",
                data.get("asset_status") or "",
                data.get("comments") or ""
            ))

            return {"status": "success"}

        except Exception as e:
            return {"status": "error", "message": str(e)}


@AssetMasterAPI.path(model=AssetMasterData, path="")
def _path():
    return AssetMasterData()

@AssetMasterAPI.json(model=AssetMasterData, request_method="GET")
def _get_all(model, request):
    plant = request.params.get("plant", None)
    return model.get_all(plant=plant)

@AssetMasterAPI.json(model=AssetMasterData, request_method="POST")
def _create(model, request):
    return model.create_item(request.json)