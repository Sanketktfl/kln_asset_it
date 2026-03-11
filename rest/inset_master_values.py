from cdb import sqlapi
import csv
from datetime import datetime

csv_file_path = r"C:\Users\ektf05110\Downloads\Asset Register-07.03.26-KTFL-2000.csv"


def convert_date(date_str):
    """Convert date from DD-MM-YYYY to datetime."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%d-%m-%Y")
    except:
        return None


def print_record(record):
    print(f"asset_code: {record.asset_code}, asset_desc: {record.asset_desc}, "
          f"plant: {record.plant}, custodian: {record.custodian}, "
          f"serial_no: {record.serial_no}")


with open(csv_file_path, 'r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)


    for row in csv_reader:

        asset_code = row['Asset Code']
        asset_class = row['Asset Class']
        asset_desc = row['Asset Desc.']
        base_unit = row['Base Unit of Measure']
        capitalized_on = convert_date(row['Capitalized on'])
        company_code = row['Company Code']
        life = row['Life']
        location = row['Sub Location']
        quantity = row['Quantity']
        custodian = row['Custodian/User']
        barcode = row['Asset Tag No.']
        manufacturer = row['Manufacturer']
        model_no = row['Model No.']
        serial_no = row['Serial No.']
        internal_order = row['Internal Order No.']
        plant = row['Plant']
        cost_center = row['Cost Center']
        acquis_val = row['Acquis.val.']
        ecc_asset = row['ECC Asset Number']
        ecc_io = row['ECC IO Number']

        try:

            existing_record = sqlapi.RecordSet2(
                "kln_asset_master",
                "asset_code = '{}'".format(asset_code)
            )

            if existing_record:

                print("Existing Record Found:")
                record = existing_record[0]
                print_record(record)

                record.asset_class = asset_class
                record.asset_desc = asset_desc
                record.base_of_unit = base_unit
                record.capitalized_on = capitalized_on
                record.company_code = company_code
                record.life = life
                record.location = location
                record.quantity = quantity
                record.custodian = custodian
                record.barcode_no = barcode
                record.manufacturer = manufacturer
                record.model_no = model_no
                record.serial_no = serial_no
                record.internal_order_no = internal_order
                record.plant = plant
                record.cost_center = cost_center
                record.acquis_val = acquis_val
                record.ecc_io_no = ecc_io

                record.update()

                print(f"Record updated: {asset_code}")

            else:

                sqlapi.Record(
                    "kln_asset_master",
                    asset_code=asset_code,
                    asset_class=asset_class,
                    asset_desc=asset_desc,
                    base_of_unit=base_unit,
                    capitalized_on=capitalized_on,
                    company_code=company_code,
                    life=life,
                    location=location,
                    quantity=quantity,
                    custodian=custodian,
                    barcode_no=barcode,
                    manufacturer=manufacturer,
                    model_no=model_no,
                    serial_no=serial_no,
                    internal_order_no=internal_order,
                    plant=plant,
                    cost_center=cost_center,
                    acquis_val=acquis_val,
                    ecc_io_no=ecc_io
                ).insert()

                print(f"Record inserted: {asset_code}")

        except Exception as e:
            print(f"Error processing asset_code {asset_code}: {e}")

print("Asset master data import completed.")