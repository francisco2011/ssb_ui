import { StorageObjectType } from "~/models/Storage/StorageObjectType";

export class CustomDataProviderImplementation {
        data = {
                root: {
                index: 'root',
                isFolder: true,
                children: [],
                data: { isDirectory: false, name: '', parent: null, type: StorageObjectType.bucket },
            }
            };

        treeChangeListeners = [];

        async getTreeItem(itemId) {
          return this.data[itemId];
        }

        async onChangeItemChildren(itemId, newChildren) {
          this.data[itemId].children = newChildren;
          this.treeChangeListeners.forEach(listener => listener([itemId]));
        }

        onDidChangeTreeData(listener) {
          this.treeChangeListeners.push(listener);
          return {
            dispose: () =>
              this.treeChangeListeners.splice(
                this.treeChangeListeners.indexOf(listener),
                1
              ),
          };
        }

        async onRenameItem(item, name) {
          this.data[item.index].data = name;
        }

        injectItem(parent, newItem) {
          if(newItem && newItem.index && !this.data[newItem.index]){
            this.data[newItem.index] = newItem
            this.data[parent.index].children.push(newItem.index);
            this.treeChangeListeners.forEach(listener => listener([parent.index]));
          }
          
          
        }
      }