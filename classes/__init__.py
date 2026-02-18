from cdb.objects import Object


class AssetMaster(Object):
    __classname__ = "kln_asset_master"
    __maps_to__ = "kln_asset_master"


class AssetScan(Object):
    __classname__ = "kln_asset_scan"
    __maps_to__ = "kln_asset_scan"
