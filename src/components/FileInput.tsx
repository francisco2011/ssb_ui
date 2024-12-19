/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

//import './Input.css';

import * as React from 'react';

type Props = Readonly<{
  'data-test-id'?: string;
  accept?: string;
  label?: string;
  onChange: (files: FileList | null) => void;
}>;

export default function ({
  accept,
  label,
  onChange,
  'data-test-id': dataTestId,
}: Props): JSX.Element {
  return (
    <div className="Input__wrapper">

      {
        label ? <label className="Input__label">{label}</label> : null
      }


      <input
        type="file"
        accept={accept}
        className="file-input input-sm file-input-bordered file-input-primary w-full max-w"
        onChange={(e) => onChange(e.target.files)}
        data-test-id={dataTestId}
      />
    </div>
  );
}