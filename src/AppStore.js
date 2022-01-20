import { observable } from 'mobx'

export class AppStore {
  @observable cdoStatus = null
  @observable cdoData = {}
  @observable acisStatus = null
  @observable acisData = []
  @observable stnName = ""
  @observable cdoNotes = 'none'
  @observable acisHas = new Array(13).fill('none')
}