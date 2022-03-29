({
    /* This function get all the SObject API names to pick particular sObject for query */
    getSObjectAPINamesHlp : function(component) {
        let action = component.get('c.getSObjectAPINamesController');
        
        action.setCallback(this, $A.getCallback(function (response) {
            let state = response.getState();

            if (state === "SUCCESS") {
                component.set('v.sObjects', JSON.parse(response.getReturnValue()));
            } else if (state === "ERROR") {
                let errors = response.getError();
                if (errors[0] && errors[0].message) {
                    console.log(`Error message: ${errors[0].message}`);
                } else {
                    console.log('Unknown error');
                }
            }
        }));
        $A.enqueueAction(action);
    },

    /* This function get all the picked SObject fields to pick particular fields for query */
    getSObjectFieldsHlp : function(component, sObjAPIName) {
        let action = component.get('c.getSObjectFieldsController');
        action.setParams({sObjectAPIName : sObjAPIName});

        action.setCallback(this, $A.getCallback(function (response) {
            let state = response.getState();

            if (state === "SUCCESS") {
                let fields = (JSON.parse(response.getReturnValue())).sort();
                let fieldWrappers = [];
                for (let index = 0; index < fields.length; index++) {
                    const element = fields[index];
                    const wrapper = {label : element, value : element};
                    fieldWrappers.push(wrapper);
                }
                component.set('v.sObjFields', fields);
                component.set('v.sObjFieldWrappers', fieldWrappers);
            } else if (state === "ERROR") {
                let errors = response.getError();
                if (errors[0] && errors[0].message) {
                    console.log(`Error message: ${errors[0].message}`);
                } else {
                    console.log('Unknown error');
                }
            }
        }));
        $A.enqueueAction(action);
    },

    /* This function refresh query after getting new data for query organization */
    updateQueryHlp : function(component) {
        component.set('v.query', component.get('v.selectFromResult') + component.get('v.filteredResult') + 
            component.get('v.sortedResult')  + component.get('v.limitedResult'));
    },

    /* This function reset the data for query organization */
    dataResetHlp : function(component) {
        component.set('v.selectFromResult', '');
        component.set('v.filteredResult', '');
        component.set('v.sortedResult', '');
        component.set('v.limitedResult', '');
    },

    setDataForTableHlp : function(component, data) {
        let dataStack = [];
        for (let index = 0; index < data.length; index++) {
            data[index].recNum = index + 1;
        }
        for (let index = 0; index < data.length; index += 10) {
            dataStack.push(data.slice(index, index + 10));            
        }
        console.log(dataStack);
        console.log(dataStack.length);
        if (dataStack.length === 1) {
            component.set('v.HasPagination', false);
        } else {
            component.set('v.pagNum', 0);
            component.set('v.currentPage', 1);
            component.set('v.allThePages', dataStack.length);
            component.set('v.isFirst', true);
            component.set('v.isLast', false);
            component.set('v.HasPagination', true);
        }
        component.set('v.tableData', dataStack[0]);
        component.set('v.dataStack', dataStack);
    },
    
    showErrorToastHlp : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Error Message',
            message:'Incorrect query, Data is not available or No data',
            duration:' 5000',
            key: 'info_alt',
            type: 'error',
            mode: 'pester'
        });
        toastEvent.fire();
    }
})