import React, {useState}from 'react';
import { useQuery, useMutation} from '@apollo/client/react';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {fetchShoppingLists} from './queries.graphql';
import {deleteShoppingLists, createShoppingList} from './mutations.graphql';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import DataTable from '@commercetools-uikit/data-table';

const cols = [
{ 
    key: 'id', 
    label: 'ID',
    renderItem: (row)=> row.id? row.id : "" 
},
{ key: 'country', 
  label: 'Country',
  renderItem: (row) => row.nameAllLocales ? row.nameAllLocales[0].value : "" 
},

];
const ShoppingLists = () => {
   const [shoppingListName, setShoppingListName] = useState("");
   
   const [shoppingListLocale, setShoppingListLocale] = useState("");

    const {error, data, loading} = useQuery(fetchShoppingLists, {

        context: {target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM}

    })
    const options = {

        refetchQueries: [{query: fetchShoppingLists, context: {target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM} }]

    }
    const [delShoppingList] = useMutation(deleteShoppingLists, options);
    const [addShoppingList] = useMutation(createShoppingList, options);

    if(loading) return 'Loading..';
    if(error) return `--Error${error.message}`;
    const handleDelete = async() => {

        const {error}  = await delShoppingList({
 
         variables: {
             version: 1,
              id: "e4c81385-56a6-448f-90dc-1d194f8dcb23" 
            },
 
         context: {target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM}
 
        })
 
     }
    console.log(data)

    const handleAddShoppingList = async (e) => {
          e.preventDefault();
      const {error, data} = await addShoppingList({

            variables: {
                 name: shoppingListName,
                locale: shoppingListLocale,

            },

            context: {target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM}

        });
           if(error) console.log(error.message);

                 console.log(data);

    }
      return (
      <>
        <form>
          <label>Locale:</label>

            <input type="text"
                value={shoppingListLocale}
                onChange={(event) => {
                   setShoppingListLocale(event.target.value)
                }}

            />
             <label>Name:</label>

            <input  type="text"
                 value={shoppingListName}
                onChange={(event) => {
                    setShoppingListName(event.target.value)

                }}

            />
             <button type="submit"
                 onClick={(e) => handleAddShoppingList(e)}
             >Add Shopping List</button>

        </form>
           <div>Shopping Lists</div>
          <button onClick={handleDelete}>Delete Shopping List</button> 
        <DataTableManager columns={cols}>

                <DataTable rows={data?.shoppingLists?.results} />
             </DataTableManager>
</>)
}
export default ShoppingLists;
