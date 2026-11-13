//dummy console
if(typeof console === 'undefined') {
    console = {};
    console.log = function() { return; }
}

jQuery(document).ready(function($) {
    console.log('init');

    function get_offset(str) {
        return seconds_from_timestring(str);
    }

    function make_offset(value) {
        return signed_srtime_from_seconds(value).substring(1);
    }

    function seconds_from_timestring(str) {
        var gen_err =
            'Expected a string of the form\n'
            + '"+\\-hours:minutes:seconds,milliseconds" '
            + '(only "seconds" is mandatory);\n'
            + 'instead got: "' + str + '" (' + typeof(str) + ').';

        if ((typeof str !== 'string') && !(str instanceof String)) throw new Error(gen_err);

        var parts = str.split(',');
        var part_count = parts.length;

        if (part_count < 1 || part_count > 2) throw new Error(gen_err);
        
        if (part_count == 2) {
            if (parts[0] === '' || parts[1] === '') throw new Error(gen_err);
        }

        var precision = 3;
        var fract_str = (part_count === 1 ? '' : parts[1])
            .padEnd(precision, '0').substring(0, precision);

        var non_digits = /[^0123456789]/;

        if (non_digits.test(fract_str)) throw new Error(gen_err);

        var maybe_signed_whole_str = parts[0];

        var negative_sign = '-';
        var positive_sign = '+';

        var is_negative =
            maybe_signed_whole_str.startsWith(negative_sign);
        
        var has_sign = is_negative
            || maybe_signed_whole_str.startsWith(positive_sign);

        var whole_str =
            maybe_signed_whole_str.substring(has_sign ? 1 : 0);
        
        var whole_comps = whole_str.split(':');
        var comps_count = whole_comps.length;
        
        var max_comps_count = 3;
        if (comps_count > max_comps_count) throw new Error(gen_err);

        var seconds_int = 0;
        for (let i = comps_count - 1; i >= 0; i--) {
            var comp = whole_comps[i];
            if (comp === '') throw new Error(gen_err);
            if (non_digits.test(comp)) throw new Error(gen_err);
            seconds_int += parseInt(comp) * Math.pow(60, comps_count - 1 - i);
        }

        return parseFloat(
            (is_negative ? '-' : '') + seconds_int + '.' + fract_str
        );
    }

    function signed_srtime_from_seconds(sec) {
        if(!Number.isFinite(sec)) {
            throw new Error(
                'Expected a finite number, instead got: '
                + sec + ' (' + typeof(sec) + ').'
            );
        }

        var absec = Math.abs(sec);
        var sign = sec < 0 ? '-' : '+';
        
        var min_digits = 2;
        /*
        Thanks to qubodup’s answer, which was based on bashdevel’s answer.
        https://stackoverflow.com/users/188159/qubodup
        https://stackoverflow.com/a/39452629
        https://stackoverflow.com/users/4554268/bashdevel
        https://stackoverflow.com/a/28451379
        */
        var hours =
            String(Math.trunc(absec / 3600)).padStart(min_digits, '0');
        var minutes =
            String(Math.trunc(absec % 3600 / 60)).padStart(min_digits, '0');
        var seconds =
            String(Math.trunc(absec % 60)).padStart(min_digits, '0');

        var absec_str = String(absec);
        var dot_idx = absec_str.indexOf('.');
        
        var precision = 3;
        /*
        Thanks to Kashan Haider's answer.
        https://stackoverflow.com/users/kashan-haider
        https://stackoverflow.com/a/59056813
        */
        var milli = (dot_idx === -1 ? '' : absec_str.substring(dot_idx + 1))
            .padEnd(precision, '0').substring(0, precision);

        return sign + hours + ':' + minutes + ':' + seconds + ',' + milli;
    }

    function calculate_index(str, offset) {
        var time = seconds_from_timestring(str);

        return {
            'old': time,
            'new': time + offset
        };
    }


    //a quick test whether the browser supports reading files and drag/drop
    if(!!window.FileReader && 'draggable' in document.createElement('div')) {
        console.log('init with file input via drag and drop');

        $('#input').on('dragover dragenter', function(e) {
            e.stopPropagation();
            e.preventDefault();

            $(this).addClass('drag').attr('placeholder', 'Drag your .srt file here');
        }).on('drop', function(e) {

            if(e.originalEvent.dataTransfer) {
                if(e.originalEvent.dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();

                    var files = e.originalEvent.dataTransfer.files;
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        $('#input').val(e.target.result);
                    };
                    reader.onerror = function(e) {
                        console.log('An error occurred during file input: '+e.target.error.code);
                    };

                    reader.readAsText(files[0]);
                }
            }

            $(this).removeClass('drag').attr('placeholder', 'Paste your .srt file content here');
        }).on('dragleave', function(e) {
            $(this).removeClass('drag').attr('placeholder', 'Paste your .srt file content here');
        });
    }


    //on form submit
    $('#container').submit(function(e) {
        e.preventDefault();

        var output = lines = [];
        var output_string = '';
        var newline = '\n';
        var input = $('#input').val();
        
        var offset = NaN;
        try {
            offset = get_offset($('#offset').val());
        } catch (error) {
            alert(error);
            return;
        }

        var segments = input.replace(/\r\n/g, '\n').split('\n\n');

        $(segments).each(function(i, e) {
            lines = e.split('\n');

            var item = {};
            item.id = parseInt(lines.shift());
            if(isNaN(item.id)) return; //don't process empty items
            item.timeindex = lines.shift();
            item.text = lines;

            var timeindices = item.timeindex.split('-->');

            //calculate original and new index times
            item.starttime = calculate_index(timeindices[0].trim(), offset);
            item.endtime = calculate_index(timeindices[1].trim(), offset);

            if (item.starttime.new < 0 || item.endtime.new < 0) return;

            output.push(item); //add to our output
        });

        //sort the output by starttime, in case we're merging two subtitle files
        //credit: http://stackoverflow.com/a/1129270/3625228
        output = output.sort(function(a,b) {
            return (a.starttime.new > b.starttime.new) ? 1 : ((b.starttime.new > a.starttime.new) ? -1 : 0);
        });

        $(output).each(function(i, e) {
            output_string += i+1+newline;
            output_string += make_offset(e.starttime.new)+' --> '+make_offset(e.endtime.new)+newline;
            for(i in e.text) {
                output_string += e.text[i]+newline;
            }
            output_string += newline;
        });

        //push this to the output textarea
        $('#output').val(output_string);
    });
});