Para los test con el servicio de PVI hay que modificar el archivo users.properties del servicio PVIService, 
ya que actualmente el sevicio se loga directamente con el usuario admin. 
Para poder hacer una prueba con el servicio off hay que tener la entrada así:

admin.password = admin
admin.pvi.account = UTC--2017-01-05T12-57-49.038440259Z--e97b27174703f8f1c6a417c0605380815f4e7aa4
admin.pvi.password = garfield123
admin.pvi.contract = 0xfedd2548cd97B78b6eFAf9784E6638D3412eC8B5
admin.owner = true
admin.online = false


En el caso de ejecutar el ppvi.bat hay que cambiar el atributo online a true y tener lanzado el contrato.