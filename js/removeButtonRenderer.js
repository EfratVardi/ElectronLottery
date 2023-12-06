class removeButtonRenderer {
  init(params) {
    this.eGui = document.createElement('span');
    this.eGui.innerHTML = `<img class="remove" onclick="remove(${params.data.id})" src="resources/icons/trash-light.svg" />`;
  }

  getGui() {
    return this.eGui;
  }

}