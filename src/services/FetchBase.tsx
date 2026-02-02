interface FOptions {
    ContentType: string | undefined
}

export default class FetchBase {

    async PutBaseNoResult<T>(url: string, body: T, options: FOptions | undefined) {
        try {
            const response = await fetch(url, {
                method: "PUT",
                body: body? JSON.stringify(body) : undefined,
                headers: options?.ContentType? new Headers({ 'content-type': options.ContentType }):undefined
            });
            if (!response.ok) throw response

        } catch (error) {
            console.error(error)
            throw error
        }

    }

    async PutBase<T, K>(url: string, body: T, foptions: FOptions | undefined) : Promise<K> {
        try {

            const isFormData = this.isFormData(body)

            const options = {
                method: "PUT",
                body:isFormData ? body : JSON.stringify(body),
            }

            if(!isFormData && foptions?.ContentType) {
                options["headers"] = new Headers({ 'content-type': foptions.ContentType })
            }

            const response = await fetch(url, options);
            
            if (!response.ok) throw response

            //204 = no content
            return await response.json();

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
                method: "DELETE"
            });

            if (!response.ok) throw response;

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    isFormData(data: any): boolean {
        return data instanceof FormData;
    }

    async PostBase<T, K>(data: T, url: string, foptions: FOptions | undefined): Promise<K> {

        try {

            const isFormData = this.isFormData(data)

            const options = {
                method: "POST",
                body: isFormData? data : JSON.stringify(data),
            }

            if(!isFormData && foptions?.ContentType) {
                options["headers"] = new Headers({ 'content-type': foptions.ContentType })
            }

            
            const response = await fetch(url, options);

            if (!response.ok) throw response

            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error)
            throw error
        }


    }

}