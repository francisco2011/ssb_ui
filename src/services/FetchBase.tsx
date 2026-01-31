export default class FetchBase {

    async PutBase<T>(url: string, body: T) {
        try {
            const response = await fetch(url, {
                method: "PUT",
                body: body? JSON.stringify(body) : undefined,
                headers: new Headers({ 'content-type': 'application/json' })
            });
            if (!response.ok) throw response
            const data = await response.json();

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async GetBase<T>(url: string): Promise<T> {
        try {

            const response = await fetch(url);
            if (!response.ok) throw response;
            
            const data = await response.json();
            return data;

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async DeleteBase(url: string) {
        try {

            const response = await fetch(url, {
                method: "DELETE",
                headers: new Headers({ 'content-type': 'application/json' }),
            });

            if (!response.ok) throw response;

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async PostBase<T, K>(data: T, url: string): Promise<K> {

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: new Headers({ 'content-type': 'application/json' }),
            });

            if (!response.ok) throw response

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error)
            throw error
        }


    }

}