class removeButtonRenderer {
  init(params) {
    this.eGui = document.createElement('span');
    this.eGui.innerHTML = `<img class="remove" onclick="remove(${params.data.id})" src="resources/icons/trash-outline.svg" />`;
  }

  getGui() {
    return this.eGui;
  }

  delete(params) {
    alert(params.name + "rtrtr")
  }
}